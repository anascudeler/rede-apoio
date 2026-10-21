import { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../api';
import { Botao, Campo, Avatar } from '../components';
import { cor } from '../theme';

export default function Perfil({ navigation }) {
  const [p, setP] = useState({ nome: '', idade: '', foto: null });
  useEffect(() => { api('/me').then((m) => setP({ ...m, idade: m.idade ? String(m.idade) : '' })); }, []);

  async function escolherFoto() {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.4, base64: true,
    });
    if (!r.canceled) setP({ ...p, foto: `data:image/jpeg;base64,${r.assets[0].base64}` });
  }

  async function salvar() {
    try {
      await api('/me', 'PUT', { nome: p.nome, idade: parseInt(p.idade, 10) || null, foto: p.foto });
      navigation.goBack();
    } catch (e) { Alert.alert('Erro', e.message); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: cor.bg, padding: 20, paddingTop: 60 }}>
      <Text style={{ fontSize: 26, fontWeight: '800', color: cor.ink }}>Meu perfil</Text>
      <Pressable onPress={escolherFoto} style={{ alignSelf: 'center', marginVertical: 16 }}>
        <Avatar pessoa={p} tamanho={96} />
        <Text style={{ color: cor.pri, fontWeight: '600', marginTop: 8, textAlign: 'center' }}>Trocar foto</Text>
      </Pressable>
      <Campo rotulo="Nome completo" value={p.nome} onChangeText={(v) => setP({ ...p, nome: v })} autoCapitalize="words" />
      <Campo rotulo="Idade" value={p.idade} onChangeText={(v) => setP({ ...p, idade: v })} keyboardType="number-pad" />
      <Botao titulo="Salvar perfil" onPress={salvar} />
    </View>
  );
}