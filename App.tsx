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
              options= {{ title: 'Login', headerShown: false}}
          />
          <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options= {{ title: 'Register', headerShown: false}}
              
          />
          <Stack.Screen 
              name="Kadastrai" 
              component={KadastraiScreen} 
              options= {{ title: 'Kadastrai'}}
          />
          <Stack.Screen 
              name="AddKadastras" 
              component={AddKadastrasScreen} 
              options= {{ title: 'Add Kadastras'}}
          />
          <Stack.Screen 
              name="Sklypai" 
              component={SklypaiScreen} 
              options= {{ title: 'Sklypai'}}
          />
          <Stack.Screen 
              name="AddSklypas" 
              component={AddSklypasScreen} 
              options= {{ title: 'Add Sklypas'}}
          />
          <Stack.Screen 
              name="Bareliai" 
              component={BareliaiScreen} 
              options= {{ title: 'Bareliai'}}
          />
          <Stack.Screen 
              name="AddBarelis" 
              component={AddBarelis} 
              options= {{ title: 'Add Barelis'}}
          />
          <Stack.Screen 
              name="Medziai" 
              component={MedziaiScreen} 
              options= {{ title: 'Medziai'}}
          />
          <Stack.Screen 
              name="AddMedis" 
              component={AddMedis} 
              options= {{ title: 'Add Medis'}}
          />


      </Stack.Navigator>
    </NavigationContainer>
  );
}