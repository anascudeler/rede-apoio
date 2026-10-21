require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASS, database: process.env.DB_NAME,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' })); // fotos em base64

// ---------- autenticação ----------
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.userId = jwt.verify(token, process.env.JWT_SECRET).id; next(); }
  catch { res.status(401).json({ erro: 'Sessão inválida.' }); }
}
const gerarToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

app.post('/auth/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !/^\S+@\S+\.\S+$/.test(email || '') || (senha || '').length < 6)
    return res.status(400).json({ erro: 'Preencha nome, e-mail válido e senha com 6+ caracteres.' });
  try {
    const hash = await bcrypt.hash(senha, 10);
    const [r] = await db.query(
      'INSERT INTO Usuario (nome, email, senha) VALUES (?, ?, ?)',
      [nome.trim(), email.trim().toLowerCase(), hash]);
    res.json({ token: gerarToken(r.insertId) });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Este e-mail já tem cadastro.' });
    res.status(500).json({ erro: 'Erro ao cadastrar.' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  const [[u]] = await db.query('SELECT id, senha FROM Usuario WHERE email = ?', [(email || '').toLowerCase()]);
  if (!u || !(await bcrypt.compare(senha || '', u.senha)))
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  res.json({ token: gerarToken(u.id) });
});

// ---------- perfil ----------
app.get('/me', auth, async (req, res) => {
  const [[u]] = await db.query('SELECT id, nome, email, idade, foto FROM Usuario WHERE id = ?', [req.userId]);
  res.json(u);
});

app.put('/me', auth, async (req, res) => {
  const { nome, idade, foto } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Informe o nome completo.' });
  await db.query('UPDATE Usuario SET nome = ?, idade = ?, foto = ? WHERE id = ?',
    [nome, idade || null, foto || null, req.userId]);
  res.json({ ok: true });
});

// ---------- localização em tempo real ----------
app.post('/locations', auth, async (req, res) => {
  const { lat, lng } = req.body;
  if (typeof lat !== 'number' || typeof lng !== 'number') return res.status(400).json({ erro: 'Coordenadas inválidas.' });
  await db.query('INSERT INTO Localizacao (fk_Usuario_id, lat, lng) VALUES (?, ?, ?)', [req.userId, lat, lng]);
  res.json({ ok: true });
});

// ---------- listas ----------
const ULTIMA_LOC = `(SELECT CONCAT(l.lat, ',', l.lng) FROM Localizacao l
                     WHERE l.fk_Usuario_id = u.id ORDER BY l.date_time DESC LIMIT 1)`;

// Apoiando: pessoas que EU acompanho (eu sou "quem_me_ve")
app.get('/apoiando', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.id, u.nome, u.foto, a.status, ${ULTIMA_LOC} AS ultima_loc
       FROM Assistir a JOIN Usuario u ON u.id = a.fk_Usuario_id_eu
      WHERE a.fk_Usuario_id_quem_me_ve = ?`, [req.userId]);
  res.json(rows);
});

// Apoiado: pessoas que me acompanham (eu sou "eu")
app.get('/apoiado', auth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.id, u.nome, u.foto, a.status
       FROM Assistir a JOIN Usuario u ON u.id = a.fk_Usuario_id_quem_me_ve
      WHERE a.fk_Usuario_id_eu = ?`, [req.userId]);
  res.json(rows);
});

app.post('/vinculos', auth, async (req, res) => {
  const { email, tipo } = req.body; // tipo: 'apoiando' | 'apoiado'
  const [[outro]] = await db.query('SELECT id FROM Usuario WHERE email = ?', [(email || '').toLowerCase()]);
  if (!outro) return res.status(404).json({ erro: 'Nenhuma conta com este e-mail.' });
  if (outro.id === req.userId) return res.status(400).json({ erro: 'Você não pode adicionar a si mesma.' });
  const [eu, qmv] = tipo === 'apoiando' ? [outro.id, req.userId] : [req.userId, outro.id];
  try {
    await db.query('INSERT INTO Assistir (fk_Usuario_id_eu, fk_Usuario_id_quem_me_ve) VALUES (?, ?)', [eu, qmv]);
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Esta pessoa já está na lista.' });
    res.status(500).json({ erro: 'Erro ao adicionar.' });
  }
});

// ---------- alerta (disparado pelo botão do chaveiro) ----------
app.post('/alerta', auth, async (req, res) => {
  const { lat, lng } = req.body || {};
  if (typeof lat === 'number' && typeof lng === 'number')
    await db.query('INSERT INTO Localizacao (fk_Usuario_id, lat, lng) VALUES (?, ?, ?)', [req.userId, lat, lng]);
  await db.query("UPDATE Assistir SET status = 'alerta' WHERE fk_Usuario_id_eu = ?", [req.userId]);
  res.json({ ok: true });
});

app.post('/alerta/cancelar', auth, async (req, res) => {
  await db.query("UPDATE Assistir SET status = 'normal' WHERE fk_Usuario_id_eu = ?", [req.userId]);
  res.json({ ok: true });
});

app.listen(process.env.PORT, () => console.log('API SafeKey na porta ' + process.env.PORT));