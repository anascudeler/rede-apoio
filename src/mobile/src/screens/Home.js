import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { api } from '../api';
import { Avatar } from '../components';
import { cores } from '../theme';

export default function Home({ navigation }) {
  const [me, setMe] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useFocusEffect(useCallback(() => { api('/me').then(setMe).catch(() => {}); }, []));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('Perfil')} accessibilityLabel="Abrir meu perfil">
          <Avatar foto={me?.foto} nome={me?.nome} tam={36} />
        </Pressable>
      ),
    });
  }, [navigation, me]);

  function confirmar() {
    const mensagem = 'Seus amigos receberão um alerta com a sua localização.';
    if (Platform.OS === 'web') {
      if (window.confirm(`Pedir ajuda?\n\n${mensagem}`)) enviar();
      return;
    }

    Alert.alert('Pedir ajuda?', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Enviar alerta', style: 'destructive', onPress: enviar },
    ]);
  }

  function avisar(titulo, mensagem) {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n\n${mensagem}`);
      return;
    }
    Alert.alert(titulo, mensagem);
  }

  async function enviar() {
    setEnviando(true);
    try {
      let loc = {};
      try {
        const p = await Location.getCurrentPositionAsync({});
        loc = { lat: p.coords.latitude, lng: p.coords.longitude };
      } catch {}
      const d = await api('/alerts', { method: 'POST', body: loc });
      if (d.enviados) avisar('Alerta enviado', `${d.enviados} amigo(s) foram avisados.`);
      else avisar('Ninguém para avisar', 'Adicione amigos em "Quem ajuda você".');
    } catch (e) {
      avisar('Erro', e.message);
    } finally {
      setEnviando(false);
    }
  }

  const Rodape = ({ titulo, tela }) => (
    <Pressable onPress={() => navigation.navigate(tela)} style={{ flex: 1, padding: 16, borderRadius: 12, backgroundColor: cores.card, borderWidth: 1.5, borderColor: cores.linha, alignItems: 'center' }}>
      <Text style={{ fontWeight: '700', color: cores.tinta }}>{titulo}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable
          onPress={confirmar}
          disabled={enviando}
          style={({ pressed }) => ({
            width: 230, height: 230, borderRadius: 115, alignItems: 'center', justifyContent: 'center',
            backgroundColor: pressed ? '#be123c' : cores.vermelho, opacity: enviando ? 0.6 : 1,
            borderWidth: 14, borderColor: 'rgba(225,29,72,0.16)',
          })}
        >
          <Text style={{ color: '#fff', fontSize: 34, fontWeight: '800' }}>{enviando ? 'Enviando...' : 'Ajuda'}</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Rodape titulo="Quem você ajuda" tela="QuemVoceAjuda" />
        <Rodape titulo="Quem ajuda você" tela="QuemAjudaVoce" />
      </View>
    </View>
  );
}