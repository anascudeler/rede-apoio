import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_API_PORT = 3000;
const CODESPACE_API_PORT = 3001;

function resolveBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  if (typeof window !== 'undefined') {
    const codespace = window.location.hostname.match(/^(.*)-\d+\.app\.github\.dev$/);
    if (codespace) {
      const port = process.env.EXPO_PUBLIC_API_PORT || CODESPACE_API_PORT;
      return `${window.location.protocol}//${codespace[1]}-${port}.app.github.dev`;
    }

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const port = process.env.EXPO_PUBLIC_API_PORT || LOCAL_API_PORT;
      return `${window.location.protocol}//${window.location.hostname}:${port}`;
    }
  }

  const port = process.env.EXPO_PUBLIC_API_PORT || LOCAL_API_PORT;
  return `http://localhost:${port}`;
}

export const BASE_URL = resolveBaseUrl();

export const getToken = () => AsyncStorage.getItem('token');
export const setToken = (t) => (t ? AsyncStorage.setItem('token', t) : AsyncStorage.removeItem('token'));

export async function api(path, { method = 'GET', body } = {}) {
  const token = await getToken();
  let r;
  try {
    r = await fetch(BASE_URL + path, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Não foi possível conectar à API em ${BASE_URL}. Verifique se o servidor está rodando e acessível.`);
    }
    throw error;
  }

  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.erro || d.message || 'Falha na requisição.');
  return d;
}