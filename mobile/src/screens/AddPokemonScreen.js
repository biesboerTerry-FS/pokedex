import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPokemon } from '../api/client';
import common from '../styles/common';

const emptyPokemon = {
  name: '',
  types: '',
  level: '5',
  sprite: '',
};

export default function AddPokemonScreen({ navigation }) {
  const [newPokemon, setNewPokemon] = useState(emptyPokemon);

  const handleCreate = async () => {
    if (!newPokemon.name.trim() || !newPokemon.types.trim()) {
      Alert.alert('Validation', 'Name and types are required.');
      return;
    }

    const payload = {
      name: newPokemon.name.trim(),
      types: newPokemon.types
        .split(',')
        .map((type) => type.trim())
        .filter(Boolean),
      level: Number(newPokemon.level) || 1,
      sprite: newPokemon.sprite.trim(),
    };

    try {
      await createPokemon(payload);
      setNewPokemon(emptyPokemon);
      Alert.alert('Success', 'New Pokémon added!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create Pokémon. Check API connection.');
    }
  };

  return (
    <SafeAreaView style={common.screen} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={[
          common.content,
          { paddingTop: 0, gap: 8, paddingHorizontal: 10 },
        ]}
      >
        <View style={[common.card, { marginTop: 4 }]}>
          <Text style={common.sectionTitle}>Add New Pokémon</Text>
          <Text style={[common.mutedText, { marginTop: 2 }]}>
            Create a new entry for your collection.
          </Text>

          <Text style={common.label}>Name</Text>
          <TextInput
            style={common.input}
            value={newPokemon.name}
            onChangeText={(value) =>
              setNewPokemon({ ...newPokemon, name: value })
            }
            placeholder="Pikachu"
            placeholderTextColor="#94a3b8"
          />

          <Text style={common.label}>Level</Text>
          <TextInput
            style={common.input}
            value={newPokemon.level}
            onChangeText={(value) =>
              setNewPokemon({ ...newPokemon, level: value })
            }
            keyboardType="numeric"
            placeholder="5"
            placeholderTextColor="#94a3b8"
          />

          <Text style={common.label}>Types (comma separated)</Text>
          <TextInput
            style={common.input}
            value={newPokemon.types}
            onChangeText={(value) =>
              setNewPokemon({ ...newPokemon, types: value })
            }
            placeholder="Electric"
            placeholderTextColor="#94a3b8"
          />

          <Text style={common.label}>Sprite Image URL</Text>
          <TextInput
            style={common.input}
            value={newPokemon.sprite}
            onChangeText={(value) =>
              setNewPokemon({ ...newPokemon, sprite: value })
            }
            placeholder="https://..."
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity
            style={[common.primaryButton, { marginTop: 16 }]}
            onPress={handleCreate}
          >
            <Text style={common.buttonText}>Add to Pokédex</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
