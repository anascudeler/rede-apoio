import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api';
import { Avatar, Botao, Campo, fmtData } from '../components';
import { cores } from '../theme';

export default function ListaScreen({ route }) {
  const ajudo = route.params.modo === 'ajudo';
  const [links, setLinks] = useState([]);
  const [reg, setReg] = useState([]);
  const [email, setEmail] = useState('');
  const [mensagemAdicao, setMensagemAdicao] = useState(null);
  const [adicionando, setAdicionando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [l, a] = await Promise.all([
        api('/links?tipo=' + (ajudo ? 'ajudo' : 'ajudam')),
        api('/alerts?tipo=' + (ajudo ? 'recebidos' : 'enviados')),
      ]);
      setLinks(l);
      setReg(a);
    } catch {}
  }, [ajudo]);

  // atualiza ao abrir a tela e a cada 10 s (para ver pedidos novos)
  useFocusEffect(useCallback(() => {
    carregar();
    const t = setInterval(carregar, 10000);
    return () => clearInterval(t);
  }, [carregar]));

  async function adicionar() {
    const emailAdicionado = email.trim();
    if (!emailAdicionado || adicionando) return;

    setAdicionando(true);
    setMensagemAdicao(null);
    try {
      await api('/links', { method: 'POST', body: { email: emailAdicionado, tipo: ajudo ? 'ajudo' : 'ajudam' } });
      setEmail('');
      setMensagemAdicao({ tipo: 'sucesso', texto: 'Amigo adicionado à sua lista.' });
      await carregar();
    } catch (e) {
      setMensagemAdicao({ tipo: 'erro', texto: e.message });
    } finally {
      setAdicionando(false);
    }
  }

  async function remover(id) {
    await api('/links/' + id, { method: 'DELETE' });
    carregar();
  }

  const card = { backgroundColor: cores.card, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1.5, borderColor: cores.linha };
  const vazio = (t) => <Text style={{ color: cores.suave, paddingVertical: 14 }}>{t}</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ color: cores.suave, marginBottom: 12 }}>
        {ajudo ? 'Amigos que podem pedir ajuda a você.' : 'Amigos que você pode acionar com o botão Ajuda.'}
      </Text>

      <View style={card}>
        {links.length === 0 && vazio('Ninguém por aqui ainda. Adicione um amigo pelo e-mail.')}
        {links.map((l) => (
          <View key={l.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: cores.linha }}>
            <Avatar foto={l.pessoa.foto} nome={l.pessoa.nome} tam={38} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: cores.tinta }}>{l.pessoa.nome}</Text>
              <Text style={{ color: cores.suave, fontSize: 13 }}>{l.pessoa.telefone}</Text>
            </View>
            <Pressable onPress={() => remover(l.id)} accessibilityLabel={'Remover ' + l.pessoa.nome}>
              <Text style={{ fontSize: 22, color: cores.suave }}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 14 }}>
        <Campo label="Adicionar amigo pelo e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="amiga@email.com" />
        <Botao
          titulo={adicionando ? 'Adicionando...' : 'Adicionar'}
          onPress={adicionar}
          disabled={adicionando || !email.trim().includes('@')}
        />
        {mensagemAdicao && (
          <Text style={{ color: mensagemAdicao.tipo === 'erro' ? cores.vermelho : cores.verde, marginTop: 8 }}>
            {mensagemAdicao.texto}
          </Text>
        )}
      </View>

      <Text style={{ fontWeight: '800', color: cores.tinta, marginTop: 24, marginBottom: 8 }}>
        {ajudo ? 'Pedidos de ajuda recebidos' : 'Pedidos de ajuda enviados'}
      </Text>
      <View style={card}>
        {reg.length === 0 && vazio(ajudo ? 'Você ainda não recebeu pedidos.' : 'Você ainda não pediu ajuda.')}
        {reg.map((a) => (
          <View key={a.id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: cores.linha }}>
            <Text style={{ fontWeight: '700', color: ajudo ? cores.vermelho : cores.tinta }}>
              {ajudo ? `${a.pessoa.nome} pediu ajuda` : `Alerta enviado a ${a.pessoa.nome}`}
            </Text>
            <Text style={{ color: cores.suave, fontSize: 13 }}>
              {fmtData(a.criadoEm)}{a.lat != null ? `  ·  ${a.lat.toFixed(4)}, ${a.lng.toFixed(4)}` : ''}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}