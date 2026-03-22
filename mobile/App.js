import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import AddPokemonScreen from './src/screens/AddPokemonScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#ef5350' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800', color: '#fff' },
          contentStyle: { backgroundColor: '#e0e7ff' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ navigation }) => ({
            title: 'Dashboard',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('AddPokemon')}
              >
                <Text
                  style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}
                >
                  Add
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="AddPokemon"
          component={AddPokemonScreen}
          options={{ title: 'Add Pokémon' }}
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
