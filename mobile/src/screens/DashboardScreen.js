import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createPokemon, getPokemonList } from '../api/client';
import { getTypeStyle } from '../utils/typeStyles';
import common from '../styles/common';

const ITEMS_PER_PAGE = 32;

const emptyPokemon = {
  name: '',
  types: '',
  level: '5',
  sprite: '',
};

export default function DashboardScreen({ navigation }) {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPokemon, setNewPokemon] = useState(emptyPokemon);

  const loadPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPokemonList();
      const cleanedData = data.map((item) => ({
        ...item,
        name: item.name.replace(/-/g, ' '),
      }));
      setPokemon(cleanedData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch Pokémon list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPokemon();
  }, [loadPokemon]);

  const filteredPokemon = useMemo(() => {
    const results = pokemon.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return results;
  }, [pokemon, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE)
  );

  const currentItems = useMemo(() => {
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const indexOfLastItem = indexOfFirstItem + ITEMS_PER_PAGE;
    return filteredPokemon.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredPokemon, currentPage]);

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
      await loadPokemon();
      Alert.alert('Success', 'New Pokémon added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create Pokémon.');
    }
  };

  return (
    <SafeAreaView style={common.screen}>
      <ScrollView contentContainerStyle={common.content}>
        <View style={common.card}>
          <Text style={[common.label, { marginTop: 0 }]}>Search Pokémon</Text>
          <TextInput
            style={common.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search Pokémon..."
          />
          <View
            style={[
              common.row,
              { justifyContent: 'space-between', marginTop: 10 },
            ]}
          >
            <Text>Results ({filteredPokemon.length})</Text>
            <View style={common.row}>
              <TouchableOpacity
                style={common.secondaryButton}
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                <Text style={common.buttonText}>Prev</Text>
              </TouchableOpacity>
              <Text>
                {currentPage} / {totalPages}
              </Text>
              <TouchableOpacity
                style={common.secondaryButton}
                disabled={currentPage >= totalPages}
                onPress={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                <Text style={common.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#dc2626" />
        ) : (
          <FlatList
            data={currentItems}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[common.card, { flex: 1 }]}
                onPress={() =>
                  navigation.navigate('PokemonDetail', { id: item._id })
                }
              >
                <Image
                  source={{
                    uri: item.sprite || 'https://via.placeholder.com/120',
                  }}
                  style={{ width: '100%', height: 110, resizeMode: 'contain' }}
                />
                <Text style={{ fontWeight: '700', marginTop: 8 }}>
                  {item.name}
                </Text>
                <Text>Lv. {item.level}</Text>
                <View style={[common.row, { flexWrap: 'wrap', marginTop: 8 }]}>
                  {item.types.map((type) => {
                    const style = getTypeStyle(type);
                    return (
                      <View
                        key={`${item._id}-${type}`}
                        style={{
                          backgroundColor: style.backgroundColor,
                          borderRadius: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: style.color,
                            fontSize: 12,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                          }}
                        >
                          {type}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <View style={common.card}>
          <Text style={[common.title, { fontSize: 22 }]}>Add New Pokémon</Text>
          <Text style={common.label}>Name</Text>
          <TextInput
            style={common.input}
            value={newPokemon.name}
            onChangeText={(value) =>
              setNewPokemon({ ...newPokemon, name: value })
            }
            placeholder="Pikachu"
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
          />

          <Text style={common.label}>Types (comma separated)</Text>
          <TextInput
            style={common.input}
            value={newPokemon.types}
            onChangeText={(value) =>
              setNewPokemon({ ...newPokemon, types: value })
            }
            placeholder="Electric"
          />

          <Text style={common.label}>Sprite Image URL</Text>
          <TextInput
            style={common.input}
            value={newPokemon.sprite}
            onChangeText={(value) =>
              setNewPokemon({ ...newPokemon, sprite: value })
            }
            placeholder="https://..."
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
