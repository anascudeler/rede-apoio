import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getToken } from './src/api';
import { cores } from './src/theme';
import CadastroScreen from './src/screens/Cadastro';
import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/Home';
import PerfilScreen from './src/screens/Perfil';
import ListaScreen from './src/screens/Lista';

const Stack = createNativeStackNavigator();

export default function App() {
  const [inicial, setInicial] = useState(null);
  useEffect(() => {
    let ativo = true;
    getToken()
      .then((token) => {
        if (ativo) setInicial(token ? 'Home' : 'Cadastro');
      })
      .catch((error) => {
        console.error('Não foi possível restaurar a sessão salva.', error);
        if (ativo) setInicial('Cadastro');
      });
    return () => { ativo = false; };
  }, []);

  if (!inicial) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.bg }}>
        <ActivityIndicator color={cores.rosa} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={inicial}
        screenOptions={{ headerStyle: { backgroundColor: cores.bg }, headerTintColor: cores.tinta, headerShadowVisible: false, contentStyle: { backgroundColor: cores.bg } }}
      >
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar conta' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Rede de Ajuda', headerBackVisible: false }} />
        <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Meu perfil' }} />
        <Stack.Screen name="QuemVoceAjuda" component={ListaScreen} initialParams={{ modo: 'ajudo' }} options={{ title: 'Quem você ajuda' }} />
        <Stack.Screen name="QuemAjudaVoce" component={ListaScreen} initialParams={{ modo: 'ajudam' }} options={{ title: 'Quem ajuda você' }} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}