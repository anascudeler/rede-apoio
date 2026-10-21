import * as SecureStore from 'expo-secure-store';

// No celular, "localhost" não é o seu computador. Use o IP da máquina (ex.: 192.168.0.10).
export const API_URL = 'http://192.168.0.10:3000';

let token = null;
export const setToken = async (t) => {
  token = t;
  t ? await SecureStore.setItemAsync('sk_token', t) : await SecureStore.deleteItemAsync('sk_token');
};
export const loadToken = async () => (token = await SecureStore.getItemAsync('sk_token'));

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