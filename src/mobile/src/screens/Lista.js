import { useState, useCallback } from 'react';
import { View, Text, FlatList, Linking, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api';
import { Botao, Campo, Avatar, Erro } from '../components';
import { cor } from '../theme';

export default function Lista({ route, navigation }) {
  const { tipo } = route.params;
  const [itens, setItens] = useState([]);
  const [form, setForm] = useState(false);
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => setItens(await api('/' + tipo)), [tipo]);
  useFocusEffect(useCallback(() => {
    carregar().catch(() => {});
    const t = setInterval(() => carregar().catch(() => {}), 5000); // atualiza o status
    return () => clearInterval(t);
  }, [carregar]));

  async function adicionar() {
    try {
      await api('/vinculos', 'POST', { email, tipo });
      setEmail(''); setErro(''); setForm(false); carregar();
    } catch (e) { setErro(e.message); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: cor.bg, padding: 20, paddingTop: 60 }}>
      <Pressable onPress={() => navigation.goBack()}><Text style={{ color: cor.pri, fontWeight: '600' }}>‹ Início</Text></Pressable>
      <Text style={{ fontSize: 26, fontWeight: '800', color: cor.ink, marginTop: 8 }}>
        {tipo === 'apoiando' ? 'Apoiando' : 'Apoiado'}
      </Text>
      <Text style={{ color: cor.mut, marginBottom: 16 }}>
        {tipo === 'apoiando' ? 'Pessoas que você está acompanhando.' : 'Pessoas que acompanham você.'}
      </Text>

      <FlatList
        data={itens}
        keyExtractor={(i) => String(i.id)}
        ListEmptyComponent={<Text style={{ color: cor.mut, textAlign: 'center', padding: 24 }}>Ninguém por aqui ainda. Toque em “Adicionar pessoa”.</Text>}
        renderItem={({ item }) => {
          const alerta = item.status === 'alerta';
          return (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cor.card, borderWidth: 1.5, borderColor: cor.line, borderRadius: 16, padding: 12, marginBottom: 10 }}>
              <Avatar pessoa={item} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: cor.ink }}>{item.nome}</Text>
                {alerta && item.ultima_loc && (
                  <Text style={{ color: cor.pri, fontSize: 13 }}
                    onPress={() => Linking.openURL(`https://www.google.com/maps?q=${item.ultima_loc}`)}>
                    Ver localização no mapa
                  </Text>)}
              </View>
              <Text style={{ fontWeight: '700', fontSize: 12, paddingVertical: 5, paddingHorizontal: 11, borderRadius: 99,
                backgroundColor: alerta ? cor.albg : cor.okbg, color: alerta ? cor.al : cor.ok, overflow: 'hidden' }}>
                {alerta ? 'Em alerta' : 'Sem alerta'}
              </Text>
            </View>
          );
        }}
      />

      {form ? (
        <View>
          <Campo rotulo="E-mail da pessoa" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Erro texto={erro} />
          <Botao titulo="Adicionar" onPress={adicionar} />
        </View>
      ) : <Botao titulo="Adicionar pessoa" ghost onPress={() => setForm(true)} />}
    </View>
  );
}