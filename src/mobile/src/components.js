import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import { cor } from './theme';

export const Botao = ({ titulo, onPress, ghost }) => (
  <Pressable onPress={onPress} style={[s.btn, ghost && s.ghost]}>
    <Text style={[s.btnTxt, ghost && { color: cor.pri }]}>{titulo}</Text>
  </Pressable>
);

export const Campo = ({ rotulo, ...props }) => (
  <View style={{ marginTop: 14 }}>
    <Text style={s.rot}>{rotulo}</Text>
    <TextInput style={s.input} placeholderTextColor={cor.mut} autoCapitalize="none" {...props} />
  </View>
);

export const Avatar = ({ pessoa, tamanho = 44 }) => (
  <View style={[s.av, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}>
    {pessoa?.foto
      ? <Image source={{ uri: pessoa.foto }} style={{ width: tamanho, height: tamanho }} />
      : <Text style={{ fontWeight: '800', fontSize: tamanho / 2.4 }}>{(pessoa?.nome || '?')[0].toUpperCase()}</Text>}
  </View>
);

export const Erro = ({ texto }) => <Text style={s.erro}>{texto}</Text>;

const s = StyleSheet.create({
  btn: { backgroundColor: cor.pri, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 18 },
  ghost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: cor.pri },
  btnTxt: { color: '#fff', fontWeight: '600', fontSize: 16 },
  rot: { fontWeight: '600', marginBottom: 6, color: cor.ink },
  input: { borderWidth: 1.5, borderColor: cor.line, borderRadius: 12, padding: 13, backgroundColor: cor.card, color: cor.ink, fontSize: 16 },
  av: { backgroundColor: cor.line, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  erro: { color: cor.al, fontWeight: '600', marginTop: 10 },
});