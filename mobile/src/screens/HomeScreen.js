import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex Master</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('../../assets/banner.png')}
          style={styles.banner}
          resizeMode="contain"
        />

        <Text style={styles.heading}>Welcome, Trainer!</Text>
        <Text style={styles.description}>
          Organize your collection, track levels, and manage sprites for your
          entire roster.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.buttonText}>Enter Pokédex</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ef5350',
    minHeight: 110,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 6,
    borderBottomColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    marginTop: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  banner: {
    width: '100%',
    alignSelf: 'stretch',
    height: 250,
    marginBottom: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#ef5350',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 999,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    textAlign: 'center',
  },
});
