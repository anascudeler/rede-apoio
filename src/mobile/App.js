import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { loadToken } from './src/api';
import { cor } from './src/theme';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Home from './src/screens/Home';
import Lista from './src/screens/Lista';
import Perfil from './src/screens/Perfil';

const Stack = createNativeStackNavigator();

export default function App() {
  const [pronto, setPronto] = useState(false);
  const [logado, setLogado] = useState(false);
  useEffect(() => {
    let ativo = true;
    loadToken()
      .then((t) => { if (ativo) setLogado(!!t); })
      .catch((error) => {
        console.error('Não foi possível restaurar a sessão salva.', error);
        if (ativo) setLogado(false);
      })
      .finally(() => { if (ativo) setPronto(true); });
    return () => { ativo = false; };
  }, []);
  if (!pronto) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cor.bg }}>
        <Text style={{ color: cor.ink }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={logado ? 'Home' : 'Login'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Apoiando" component={Lista} initialParams={{ tipo: 'apoiando' }} />
        <Stack.Screen name="Apoiado" component={Lista} initialParams={{ tipo: 'apoiado' }} />
        <Stack.Screen name="Perfil" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}