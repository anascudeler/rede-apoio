import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { api, setToken } from '../api';
import { Avatar, Botao, Campo } from '../components';
import { cores } from '../theme';

export default function Perfil({ navigation }) {
  const [me, setMe] = useState(null);
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({});
  const [erro, setErro] = useState('');
  const [locOk, setLocOk] = useState(false);

  useEffect(() => {
    api('/me').then(setMe).catch(() => {});
    Location.getForegroundPermissionsAsync().then((p) => setLocOk(p.status === 'granted'));
  }, []);

  if (!me) return null;
  const set = (k) => (v) => setF({ ...f, [k]: v });

  function iniciar() {
    setF({ nome: me.nome, email: me.email, telefone: me.telefone, senha: '', foto: me.foto });
    setErro('');
    setEdit(true);
  }

  async function trocarFoto() {
    const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.4, base64: true });
    if (!r.canceled) setF({ ...f, foto: 'data:image/jpeg;base64,' + r.assets[0].base64 });
  }

  async function salvar() {
    try {
      const body = { nome: f.nome, email: f.email, telefone: f.telefone, senha: f.senha };
      if (f.foto !== me.foto) body.foto = f.foto;
      setMe(await api('/me', { method: 'PUT', body }));
      setEdit(false);
    } catch (e) {
      setErro(e.message);
    }
  }

  async function sair() {
    await setToken(null);
    navigation.reset({ index: 0, routes: [{ name: 'Cadastro' }] });
  }

  const Linha = ({ rotulo, valor }) => (
    <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: cores.linha }}>
      <Text style={{ color: cores.suave, fontSize: 13 }}>{rotulo}</Text>
      <Text style={{ color: cores.tinta, fontWeight: '700', fontSize: 16 }}>{valor}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={edit ? trocarFoto : undefined} style={{ alignSelf: 'center', marginBottom: 8 }}>
          <Avatar foto={edit ? f.foto : me.foto} nome={me.nome} tam={120} />
        </Pressable>
        {edit && <Text style={{ textAlign: 'center', color: cores.suave, marginBottom: 12 }}>Toque na foto para trocar</Text>}

        {!edit ? (
          <View style={{ backgroundColor: cores.card, borderRadius: 14, paddingHorizontal: 14, marginTop: 12 }}>
            <Linha rotulo="Nome" valor={me.nome} />
            <Linha rotulo="E-mail" valor={me.email} />
            <Linha rotulo="Telefone" valor={me.telefone} />
            <Linha rotulo="Senha" valor="••••••••" />
            <Linha rotulo="Localização" valor={locOk ? 'Compartilhamento ativo' : 'Não permitida'} />
          </View>
        ) : (
          <View>
            <Campo label="Nome" value={f.nome} onChangeText={set('nome')} autoCapitalize="words" />
            <Campo label="E-mail" value={f.email} onChangeText={set('email')} keyboardType="email-address" />
            <Campo label="Telefone" value={f.telefone} onChangeText={set('telefone')} keyboardType="phone-pad" />
            <Campo label="Nova senha" value={f.senha} onChangeText={set('senha')} secureTextEntry placeholder="Deixe em branco para manter" />
            {!!erro && <Text style={{ color: cores.vermelho }}>{erro}</Text>}
          </View>
        )}
        {!edit && <Botao titulo="Sair da conta" tipo="secundario" onPress={sair} style={{ marginTop: 20 }} />}
      </ScrollView>

      <View style={{ padding: 20, flexDirection: 'row', gap: 12 }}>
        {edit ? (
          <>
            <Botao titulo="Cancelar" tipo="secundario" onPress={() => setEdit(false)} style={{ flex: 1 }} />
            <Botao titulo="Salvar" onPress={salvar} style={{ flex: 1 }} />
          </>
        ) : (
          <Botao titulo="Editar perfil" onPress={iniciar} style={{ flex: 1 }} />
        )}
      </View>
    </View>
  );
}