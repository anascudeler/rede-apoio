import React from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { cores } from './theme';

export function Campo({ label, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: cores.tinta, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
      <TextInput
        placeholderTextColor={cores.suave}
        autoCapitalize="none"
        style={{ backgroundColor: '#fffafc', borderWidth: 1.5, borderColor: cores.linha, borderRadius: 10, padding: 12, fontSize: 16, color: cores.tinta }}
        {...props}
      />
    </View>
  );
}

export function Botao({ titulo, onPress, tipo = 'primario', disabled, style }) {
  const sec = tipo === 'secundario';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        { padding: 14, borderRadius: 12, alignItems: 'center', opacity: disabled ? 0.6 : 1,
          backgroundColor: sec ? 'transparent' : cores.rosa, borderWidth: sec ? 1.5 : 0, borderColor: cores.linha },
        style,
      ]}
    >
      <Text style={{ color: sec ? cores.tinta : '#fff', fontWeight: '800', fontSize: 16 }}>{titulo}</Text>
    </Pressable>
  );
}

export function Avatar({ foto, nome = '?', tam = 40 }) {
  const base = { width: tam, height: tam, borderRadius: tam / 2, backgroundColor: cores.linha, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' };
  return (
    <View style={base}>
      {foto ? (
        <Image source={{ uri: foto }} style={{ width: tam, height: tam }} />
      ) : (
        <Text style={{ fontWeight: '800', color: cores.suave, fontSize: tam / 2.4 }}>{nome.trim().charAt(0).toUpperCase()}</Text>
      )}
    </View>
  );
}

export const fmtData = (d) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });