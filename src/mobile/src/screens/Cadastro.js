import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { api, setToken } from '../api';
import { Botao, Campo, Erro } from '../components';
import { cor } from '../theme';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar() {
    setErro('');
    try {
      const { token } = await api('/auth/register', 'POST', {
        name: nome,
        email,
        password: senha,
      });
      await setToken(token);
      navigation.replace('Home');
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: cor.bg, padding: 20, paddingTop: 70 }}>
      <Text style={{ fontSize: 32, fontWeight: '800', color: cor.ink }}>Criar conta</Text>
      <Campo rotulo="Nome" value={nome} onChangeText={setNome} />
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Campo rotulo="Senha (mínimo 6 caracteres)" value={senha} onChangeText={setSenha} secureTextEntry />
      <Erro texto={erro} />
      <Botao titulo="Cadastrar" onPress={cadastrar} />
      <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
        <Text style={{ color: cor.pri, fontWeight: '600', textAlign: 'center' }}>Já tenho conta</Text>
      </Pressable>
    </View>
  );
}