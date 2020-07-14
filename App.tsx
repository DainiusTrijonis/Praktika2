import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/authentication/Login'
import RegisterScreen from './src/screens/authentication/Register'

import HomeScreen from './src/screens/Home'

import KadastraiScreen from './src/screens/Kadastrai'
import AddKadastrasScreen from './src/screens/AddKadastras'

import SklypaiScreen from './src/screens/Sklypai'
import AddSklypasScreen from './src/screens/AddSklypas'

import BareliaiScreen from './src/screens/Bareliai'
import AddBarelis from './src/screens/AddBarelis'

import MedziaiScreen from './src/screens/Medziai'
import AddMedis from './src/screens/AddMedis'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options= {{ title: 'Home', headerShown: false}}
          />
          <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options= {{ title: 'Prisijungimas', headerShown: false}}
          />
          <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options= {{ title: 'Registracija', headerShown: false}}
              
          />
          <Stack.Screen 
              name="Kadastrai" 
              component={KadastraiScreen} 
              options= {{ title: 'Kadastrai'}}
          />
          <Stack.Screen 
              name="AddKadastras" 
              component={AddKadastrasScreen} 
              options= {{ title: 'Pridėti kadastrą'}}
          />
          <Stack.Screen 
              name="Sklypai" 
              component={SklypaiScreen} 
              options= {{ title: 'Sklypai'}}
          />
          <Stack.Screen 
              name="AddSklypas" 
              component={AddSklypasScreen} 
              options= {{ title: 'Pridėti sklypą'}}
          />
          <Stack.Screen 
              name="Bareliai" 
              component={BareliaiScreen} 
              options= {{ title: 'Bareliai'}}
          />
          <Stack.Screen 
              name="AddBarelis" 
              component={AddBarelis} 
              options= {{ title: 'Pridėti barelį'}}
          />
          <Stack.Screen 
              name="Medziai" 
              component={MedziaiScreen} 
              options= {{ title: 'Medžiai'}}
          />
          <Stack.Screen 
              name="AddMedis" 
              component={AddMedis} 
              options= {{ title: 'Pridėti medį'}}
          />


      </Stack.Navigator>
    </NavigationContainer>
  );
}