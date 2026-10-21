import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { api, setToken } from '../api';
import { Botao, Avatar } from '../components';
import { cor } from '../theme';
import { useChaveiro } from '../ble';

export default function Home({ navigation }) {
  const [eu, setEu] = useState(null);
  const [contagem, setContagem] = useState({ apoiando: 0, apoiado: 0 });
  const [emAlerta, setEmAlerta] = useState(false);
  const [coords, setCoords] = useState(null);
  const [msgLoc, setMsgLoc] = useState('Localização: aguardando permissão…');
  const posRef = useRef(null);

  const carregar = useCallback(async () => {
    const [me, a, b] = await Promise.all([api('/me'), api('/apoiando'), api('/apoiado')]);
    setEu(me);
    setContagem({ apoiando: a.length, apoiado: b.length });
    setEmAlerta(b.some((p) => p.status === 'alerta'));
  }, []);
  useFocusEffect(useCallback(() => { carregar().catch(() => {}); }, [carregar]));

  // Localização em tempo real: atualiza a tela e envia à API a cada ~10 s
  useEffect(() => {
    let sub, ultimo = 0;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return setMsgLoc('Permita o acesso à localização para usar o SafeKey.');
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
        (p) => {
          const c = { lat: p.coords.latitude, lng: p.coords.longitude };
          posRef.current = c; setCoords(c);
          setMsgLoc(`Localização ativa: ${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`);
          if (Date.now() - ultimo > 10000) { ultimo = Date.now(); api('/locations', 'POST', c).catch(() => {}); }
        });
    })();
    return () => sub?.remove();
  }, []);

  // Função disparada pelo botão do chaveiro
  const dispararAlerta = useCallback(async () => {
    try {
      await api('/alerta', 'POST', posRef.current || {});
      Alert.alert('Alerta enviado', 'Sua rede de apoio foi avisada com a sua localização.');
      carregar();
    } catch (e) { Alert.alert('Erro', e.message); }
  }, [carregar]);

  const { conectado, nomeDisp, conectar } = useChaveiro(dispararAlerta);

  async function cancelar() { await api('/alerta/cancelar', 'POST'); carregar(); }
  async function sair() { await setToken(null); navigation.replace('Login'); }

  return (
    <View style={{ flex: 1, backgroundColor: cor.bg, padding: 20, paddingTop: 60 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: cor.ink }}>Olá, {eu?.nome?.split(' ')[0]}.</Text>
        <Pressable onPress={() => navigation.navigate('Perfil')}><Avatar pessoa={eu} /></Pressable>
      </View>

      <View style={{ backgroundColor: emAlerta ? cor.albg : cor.okbg, borderRadius: 24, padding: 26, alignItems: 'center', marginVertical: 18 }}>
        <View style={{ width: 118, height: 118, borderRadius: 59, borderWidth: 8, borderColor: emAlerta ? cor.al : cor.ok, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: '800', color: emAlerta ? cor.al : cor.ok }}>{emAlerta ? 'Alerta' : 'Tudo certo'}</Text>
        </View>
        <Text style={{ marginTop: 12, fontWeight: '600', color: cor.ink }}>
          {emAlerta ? 'Alerta enviado à sua rede de apoio' : 'Nenhum alerta ativo'}
        </Text>
        <Text style={{ color: cor.ink, opacity: 0.7, marginTop: 4, fontSize: 12 }}>{msgLoc}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        {['Apoiando', 'Apoiado'].map((n) => (
          <Pressable key={n} onPress={() => navigation.navigate(n)}
            style={{ flex: 1, backgroundColor: cor.card, borderWidth: 1.5, borderColor: cor.line, borderRadius: 18, padding: 18 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: cor.ink }}>{n}</Text>
            <Text style={{ color: cor.mut }}>{contagem[n.toLowerCase()]} pessoas</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ marginTop: 16, color: cor.mut }}>
        {conectado ? `● Conectado: ${nomeDisp}` : '○ Chaveiro desconectado'}
      </Text>
      <Botao titulo="Conectar chaveiro por Bluetooth" ghost onPress={conectar} />
      <Botao titulo="Simular botão do chaveiro" ghost onPress={dispararAlerta} />
      {emAlerta && <Botao titulo="Estou bem, cancelar alerta" onPress={cancelar} />}
      <Pressable onPress={sair} style={{ marginTop: 18 }}>
        <Text style={{ color: cor.pri, fontWeight: '600', textAlign: 'center' }}>Sair</Text>
      </Pressable>
    </View>
  );
}