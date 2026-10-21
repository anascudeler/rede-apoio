import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { api, setToken } from '../api';
import { Botao, Campo, Erro } from '../components';
import { cor } from '../theme';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function entrar() {
    try {
      const { token } = await api('/auth/login', 'POST', { email, senha });
      await setToken(token);
      navigation.replace('Home');
    } catch (e) { setErro(e.message); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: cor.bg, padding: 20, paddingTop: 70 }}>
      <Text style={{ fontSize: 32, fontWeight: '800', color: cor.ink }}>Entrar</Text>
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Campo rotulo="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Erro texto={erro} />
      <Botao titulo="Entrar" onPress={entrar} />
      <Pressable onPress={() => navigation.navigate('Cadastro')} style={{ marginTop: 16 }}>
        <Text style={{ color: cor.pri, fontWeight: '600', textAlign: 'center' }}>Ainda não tenho conta</Text>
      </Pressable>
    </View>
  );
}