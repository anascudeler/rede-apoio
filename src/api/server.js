require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const codespaceName = process.env.CODESPACE_NAME;
const forwardingDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';

function isAllowedOrigin(origin) {
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  if (!codespaceName) return false;

  try {
    const url = new URL(origin);
    const suffix = `.${forwardingDomain}`;
    const prefix = `${codespaceName}-`;
    return url.protocol === 'https:'
      && url.hostname.startsWith(prefix)
      && url.hostname.endsWith(suffix)
      && /^\d+$/.test(url.hostname.slice(prefix.length, -suffix.length));
  } catch {
    return false;
  }
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

const SECRET = process.env.JWT_SECRET || 'troque-isto';
const pub = (u) => ({ id: u.id, nome: u.name, email: u.email, telefone: u.telefone, foto: u.foto, lat: u.lat, lng: u.lng });
const leve = (u) => ({ id: u.id, nome: u.name, telefone: u.telefone, foto: u.foto });
const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    if (e.code === 'P2002') return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    console.error(e);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  });

function auth(req, res, next) {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.uid = jwt.verify(t, SECRET).uid;
    next();
  } catch {
    res.status(401).json({ erro: 'Sessão inválida. Entre novamente.' });
  }
}
const token = (u) => jwt.sign({ uid: u.id }, SECRET, { expiresIn: '30d' });

// ---------- Auth ----------
app.post('/auth/register', wrap(async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  if (!nome || !email || !senha || senha.length < 6 || !telefone)
    return res.status(400).json({ erro: 'Dados incompletos.' });
  const u = await prisma.user.create({
    data: { name: nome.trim(), email: email.trim().toLowerCase(), telefone: telefone.trim(), passwordHash: await bcrypt.hash(senha, 10) },
  });
  res.json({ token: token(u), user: pub(u) });
}));

app.post('/auth/login', wrap(async (req, res) => {
  const u = await prisma.user.findUnique({ where: { email: (req.body.email || '').trim().toLowerCase() } });
  if (!u || !(await bcrypt.compare(req.body.senha || '', u.passwordHash)))
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  res.json({ token: token(u), user: pub(u) });
}));

// ---------- Perfil ----------
app.get('/me', auth, wrap(async (req, res) => {
  res.json(pub(await prisma.user.findUnique({ where: { id: req.uid } })));
}));

app.put('/me', auth, wrap(async (req, res) => {
  const { nome, email, telefone, senha, foto } = req.body;
  const data = {};
  if (nome) data.name = nome.trim();
  if (email) data.email = email.trim().toLowerCase();
  if (telefone) data.telefone = telefone.trim();
  if (foto) data.foto = foto;
  if (senha) {
    if (senha.length < 6) return res.status(400).json({ erro: 'A senha precisa ter ao menos 6 caracteres.' });
    data.passwordHash = await bcrypt.hash(senha, 10);
  }
  res.json(pub(await prisma.user.update({ where: { id: req.uid }, data })));
}));

app.put('/me/location', auth, wrap(async (req, res) => {
  const { lat, lng } = req.body;
  await prisma.user.update({ where: { id: req.uid }, data: { lat, lng } });
  res.json({ ok: true });
}));

// ---------- Amizades ----------
// tipo=ajudo  -> pessoas que podem pedir ajuda a mim
// tipo=ajudam -> pessoas que me ajudam
app.get('/links', auth, wrap(async (req, res) => {
  if (req.query.tipo === 'ajudo') {
    const l = await prisma.link.findMany({ where: { helperId: req.uid }, include: { requester: true }, orderBy: { id: 'desc' } });
    return res.json(l.map((x) => ({ id: x.id, pessoa: leve(x.requester) })));
  }
  const l = await prisma.link.findMany({ where: { requesterId: req.uid }, include: { helper: true }, orderBy: { id: 'desc' } });
  res.json(l.map((x) => ({ id: x.id, pessoa: leve(x.helper) })));
}));

app.post('/links', auth, wrap(async (req, res) => {
  const outro = await prisma.user.findUnique({ where: { email: (req.body.email || '').trim().toLowerCase() } });
  if (!outro) return res.status(404).json({ erro: 'Esse e-mail ainda não tem conta no app.' });
  if (outro.id === req.uid) return res.status(400).json({ erro: 'Você não pode adicionar a si mesmo.' });
  const ajudo = req.body.tipo === 'ajudo';
  const data = ajudo ? { helperId: req.uid, requesterId: outro.id } : { requesterId: req.uid, helperId: outro.id };
  const ja = await prisma.link.findFirst({ where: data });
  if (ja) return res.status(409).json({ erro: 'Essa pessoa já está na lista.' });
  await prisma.link.create({ data });
  res.json({ ok: true });
}));

app.delete('/links/:id', auth, wrap(async (req, res) => {
  await prisma.link.deleteMany({
    where: { id: Number(req.params.id), OR: [{ requesterId: req.uid }, { helperId: req.uid }] },
  });
  res.json({ ok: true });
}));

// ---------- Alertas ----------
app.post('/alerts', auth, wrap(async (req, res) => {
  const { lat, lng } = req.body;
  const ajudantes = await prisma.link.findMany({ where: { requesterId: req.uid } });
  if (lat != null) await prisma.user.update({ where: { id: req.uid }, data: { lat, lng } });
  await prisma.alert.createMany({
    data: ajudantes.map((l) => ({ senderId: req.uid, recipientId: l.helperId, lat: lat ?? null, lng: lng ?? null })),
  });
  res.json({ enviados: ajudantes.length });
}));

app.get('/alerts', auth, wrap(async (req, res) => {
  if (req.query.tipo === 'recebidos') {
    const a = await prisma.alert.findMany({ where: { recipientId: req.uid }, include: { sender: true }, orderBy: { createdAt: 'desc' }, take: 100 });
    return res.json(a.map((x) => ({ id: x.id, pessoa: leve(x.sender), criadoEm: x.createdAt, lat: x.lat, lng: x.lng })));
  }
  const a = await prisma.alert.findMany({ where: { senderId: req.uid }, include: { recipient: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  res.json(a.map((x) => ({ id: x.id, pessoa: leve(x.recipient), criadoEm: x.createdAt, lat: x.lat, lng: x.lng })));
}));

app.listen(process.env.PORT || 3000, () => console.log('API rodando na porta ' + (process.env.PORT || 3000)));