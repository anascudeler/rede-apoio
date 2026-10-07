import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/login';
import Cadastro from './src/screens/cadastro';
import Home from './src/screens/home';
import Apoiando from './src/screens/apoiando';
import Apoiado from './src/screens/apoiado';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'SafeKey' }}
        />

        <Stack.Screen 
          name="Cadastro" 
          component={Cadastro} 
          options={{ title: 'Cadastro' }}
        />

        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Início' }}
        />

        <Stack.Screen 
          name="Apoiando" 
          component={Apoiando} 
          options={{ title: 'Apoiando' }}
        />

        <Stack.Screen 
          name="Apoiado" 
          component={Apoiado} 
          options={{ title: 'Apoiado' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}