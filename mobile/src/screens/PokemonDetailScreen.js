import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  deletePokemon,
  getApiBaseUrl,
  getPokemonById,
  updatePokemon,
} from '../api/client';
import common from '../styles/common';
import { getTypeStyle } from '../utils/typeStyles';

export default function PokemonDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState(null);
  const [editValues, setEditValues] = useState({
    name: '',
    types: '',
    level: '',
    sprite: '',
  });

  const loadPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPokemonById(id);
      setPokemon(data);
      setEditValues({
        name: data.name,
        types: (data.types || []).join(', '),
        level: String(data.level ?? ''),
        sprite: data.sprite || '',
      });
    } catch (error) {
      Alert.alert(
        'Connection error',
        `Could not load Pokémon details from ${getApiBaseUrl()}.`
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    loadPokemon();
  }, [loadPokemon]);

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...editValues,
        level: Number(editValues.level) || 1,
        types: editValues.types
          .split(',')
          .map((type) => type.trim())
          .filter(Boolean),
      };
      const data = await updatePokemon(id, updatedData);
      setPokemon(data);
      Alert.alert('Success', 'Pokémon updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update Pokémon. Check API connection.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Release Pokémon',
      'Are you sure you want to release this Pokémon?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Release',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePokemon(id);
              navigation.navigate('Dashboard');
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to delete Pokémon. Check API connection.'
              );
            }
          },
        },
      ]
    );
  };

  if (loading || !pokemon) {
    return (
      <SafeAreaView style={common.screen}>
        <View style={[common.content, { flex: 1, justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#dc2626" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={common.screen} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={[
          common.content,
          { paddingTop: 0, paddingBottom: 8, gap: 8, paddingHorizontal: 10 },
        ]}
      >
        <View style={[common.card, { marginTop: 4 }]}>
          <Text style={common.sectionTitle}>Update Pokémon</Text>
          <Image
            source={{
              uri: pokemon.sprite || 'https://via.placeholder.com/180',
            }}
            style={{ width: '100%', height: 220, resizeMode: 'contain' }}
          />

          <Text style={[common.title, { fontSize: 24 }]}>{pokemon.name}</Text>
          <Text style={common.subtitle}>Level {pokemon.level}</Text>
          <View
            style={[common.row, { justifyContent: 'center', flexWrap: 'wrap' }]}
          >
            {(pokemon.types || []).map((type) => {
              const style = getTypeStyle(type);
              return (
                <View
                  key={type}
                  style={[
                    common.badge,
                    { backgroundColor: style.backgroundColor },
                  ]}
                >
                  <Text style={[common.badgeText, { color: style.color }]}>
                    {type}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={common.label}>Name</Text>
          <TextInput
            style={common.input}
            value={editValues.name}
            onChangeText={(value) =>
              setEditValues({ ...editValues, name: value })
            }
            placeholderTextColor="#94a3b8"
          />

          <Text style={common.label}>Level</Text>
          <TextInput
            style={common.input}
            value={editValues.level}
            keyboardType="numeric"
            onChangeText={(value) =>
              setEditValues({ ...editValues, level: value })
            }
            placeholderTextColor="#94a3b8"
          />

          <Text style={common.label}>Types (comma separated)</Text>
          <TextInput
            style={common.input}
            value={editValues.types}
            onChangeText={(value) =>
              setEditValues({ ...editValues, types: value })
            }
            placeholderTextColor="#94a3b8"
          />

          <Text style={common.label}>Sprite Image URL</Text>
          <TextInput
            style={common.input}
            value={editValues.sprite}
            onChangeText={(value) =>
              setEditValues({ ...editValues, sprite: value })
            }
            placeholderTextColor="#94a3b8"
          />

          <View style={[common.row, { marginTop: 16 }]}>
            <TouchableOpacity
              style={[
                common.secondaryButton,
                { flex: 1, backgroundColor: '#991b1b' },
              ]}
              onPress={handleDelete}
            >
              <Text style={common.buttonText}>Release</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[common.primaryButton, { flex: 1 }]}
              onPress={handleUpdate}
            >
              <Text style={common.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
