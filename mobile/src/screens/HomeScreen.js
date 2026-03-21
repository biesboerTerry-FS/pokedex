import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import common from '../styles/common';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={common.screen}>
      <View style={[common.content, { flex: 1, justifyContent: 'center' }]}>
        <Text style={common.title}>Pokédex Master</Text>
        <Text style={common.subtitle}>Welcome, Trainer!</Text>
        <Text style={common.subtitle}>
          Organize your collection, track levels, and manage sprites for your
          entire roster.
        </Text>
        <TouchableOpacity
          style={common.primaryButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={common.buttonText}>Enter Pokédex</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
