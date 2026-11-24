import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { api, setToken } from '../api';
import { Botao, Campo } from '../components';
import { cores } from '../theme';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function entrar() {
    try {
      const d = await api('/auth/login', { method: 'POST', body: { email, senha } });
      await setToken(d.token);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Campo label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Campo label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      {!!erro && <Text style={{ color: cores.vermelho, marginBottom: 10 }}>{erro}</Text>}
      <Botao titulo="Entrar" onPress={entrar} />
    </ScrollView>
  );
}