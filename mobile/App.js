import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import AddPokemonScreen from './src/screens/AddPokemonScreen';

const Stack = createNativeStackNavigator();

function DashboardHeaderRight({ navigation }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddPokemon')}
        accessibilityRole="button"
        accessibilityLabel="Add Pokémon"
        style={{ marginRight: 6 }}
      >
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function AppNavigator() {
  return (
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
          headerRight: () => <DashboardHeaderRight navigation={navigation} />,
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
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
