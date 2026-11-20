import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// No celular, "localhost" não é o seu computador. Use o IP da máquina (ex.: 192.168.0.10).
export const API_URL = 'http://192.168.0.10:3000';

const TOKEN_KEY = 'sk_token';
let token = null;
export const setToken = async (t) => {
  token = t;
  if (Platform.OS === 'web') {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
    return;
  }
  t ? await SecureStore.setItemAsync(TOKEN_KEY, t) : await SecureStore.deleteItemAsync(TOKEN_KEY);
};
export const loadToken = async () => {
  token = Platform.OS === 'web'
    ? localStorage.getItem(TOKEN_KEY)
    : await SecureStore.getItemAsync(TOKEN_KEY);
  return token;
};

export async function api(path, method = 'GET', body) {
  const r = await fetch(API_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.erro || 'Erro de conexão.');
  return data;
}