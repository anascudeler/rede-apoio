import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { api, setToken } from '../api';
import { Botao, Campo } from '../components';
import { cores } from '../theme';

export default function Cadastro({ navigation }) {
  const [f, setF] = useState({ nome: '', email: '', senha: '', telefone: '' });
  const [loc, setLoc] = useState('pendente');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  async function pedirLoc() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLoc(status === 'granted' ? 'permitida' : 'negada');
    return status === 'granted';
  }

  async function criar() {
    setErro('');
    if (f.nome.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(f.email) || f.senha.length < 6 || f.telefone.replace(/\D/g, '').length < 10)
      return setErro('Preencha nome, e-mail válido, senha (mín. 6 caracteres) e telefone com DDD.');
    setCarregando(true);
    try {
      const d = await api('/auth/register', { method: 'POST', body: f });
      await setToken(d.token);
      if (loc === 'pendente') await pedirLoc();
      try {
        const p = await Location.getCurrentPositionAsync({});
        await api('/me/location', { method: 'PUT', body: { lat: p.coords.latitude, lng: p.coords.longitude } });
      } catch {}
      navigation.replace('Home');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  const textoLoc = { pendente: 'Ainda não permitida', permitida: 'Compartilhamento ativo', negada: 'Permissão negada' }[loc];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ color: cores.suave, marginBottom: 16 }}>Cadastre-se para avisar seus amigos quando precisar de ajuda.</Text>
      <Campo label="Nome" value={f.nome} onChangeText={set('nome')} autoCapitalize="words" />
      <Campo label="E-mail" value={f.email} onChangeText={set('email')} keyboardType="email-address" />
      <Campo label="Senha" value={f.senha} onChangeText={set('senha')} secureTextEntry />
      <Campo label="Telefone" value={f.telefone} onChangeText={set('telefone')} keyboardType="phone-pad" placeholder="(11) 90000-0000" />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: cores.card, borderWidth: 1.5, borderColor: cores.linha, borderRadius: 12, padding: 12, marginBottom: 14 }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={{ fontWeight: '700', color: cores.tinta }}>Compartilhar localização</Text>
          <Text style={{ color: cores.suave, fontSize: 13 }}>{textoLoc}</Text>
        </View>
        <Botao titulo="Permitir" onPress={pedirLoc} style={{ paddingVertical: 8, paddingHorizontal: 14 }} />
      </View>

      {!!erro && <Text style={{ color: cores.vermelho, marginBottom: 10 }}>{erro}</Text>}
      <Botao titulo={carregando ? 'Criando...' : 'Criar conta'} onPress={criar} disabled={carregando} />
      <Botao titulo="Já tenho conta" tipo="secundario" onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }} />
    </ScrollView>
  );
}