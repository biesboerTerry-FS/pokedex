import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1f1f1f' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#f3f4f6' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Pokédex Master' }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Trainer Dashboard' }}
        />
        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={{ title: 'Management Portal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
