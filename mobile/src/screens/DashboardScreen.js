import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPokemonList } from '../api/client';
import { getTypeStyle } from '../utils/typeStyles';
import common from '../styles/common';

const ITEMS_PER_PAGE = 33;

export default function DashboardScreen({ navigation }) {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      Alert.alert('Connection error', 'Could not reach API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPokemon();
    }, [loadPokemon])
  );

  const filteredPokemon = useMemo(() => {
    return pokemon.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemon, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE)
  );

  const currentItems = useMemo(() => {
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const indexOfLastItem = indexOfFirstItem + ITEMS_PER_PAGE;
    return filteredPokemon.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredPokemon, currentPage]);

  const renderPaginationControls = () => (
    <View
      style={[
        common.row,
        {
          justifyContent: 'space-between',
          marginTop: 0,
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
      ]}
    >
      <Text style={{ fontWeight: '800', color: '#ffffff' }}>
        Results ({filteredPokemon.length})
      </Text>
      <View style={common.row}>
        <TouchableOpacity
          style={[
            common.secondaryButton,
            currentPage === 1 && { opacity: 0.45 },
          ]}
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((page) => Math.max(1, page - 1))}
        >
          <Text style={common.buttonText}>Prev</Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: '800', color: '#ffffff' }}>
          {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity
          style={[
            common.secondaryButton,
            currentPage >= totalPages && { opacity: 0.45 },
          ]}
          disabled={currentPage >= totalPages}
          onPress={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
        >
          <Text style={common.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={common.screen} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={[
          common.content,
          { paddingTop: 0, paddingBottom: 56, gap: 8, paddingHorizontal: 10 },
        ]}
      >
        <View style={[common.card, { marginTop: 4 }]}>
          <Text style={[common.label, { marginTop: 0 }]}>Search Pokémon</Text>
          <TextInput
            style={common.input}
            value={searchTerm}
            onChangeText={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            placeholder="Search Pokémon..."
            placeholderTextColor="#94a3b8"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#dc2626" />
        ) : (
          <FlatList
            data={currentItems}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            numColumns={3}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pokemonCard}
                onPress={() =>
                  navigation.navigate('PokemonDetail', { id: item._id })
                }
              >
                <Image
                  source={{
                    uri: item.sprite || 'https://via.placeholder.com/120',
                  }}
                  style={styles.sprite}
                />
                <Text style={styles.nameText} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.levelText}>Lv. {item.level}</Text>
                <View style={styles.typeRow}>
                  {item.types.map((type) => {
                    const style = getTypeStyle(type);
                    return (
                      <View
                        key={`${item._id}-${type}`}
                        style={[
                          common.badge,
                          styles.typeBadge,
                          { backgroundColor: style.backgroundColor },
                        ]}
                      >
                        <Text
                          style={[
                            common.badgeText,
                            styles.typeBadgeText,
                            { color: style.color },
                          ]}
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
      </ScrollView>

      {!loading && (
        <View style={styles.stickyPagination}>
          {renderPaginationControls()}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pokemonCard: {
    ...common.card,
    flex: 1,
    minHeight: 170,
    padding: 10,
  },
  sprite: {
    width: '100%',
    height: 72,
    resizeMode: 'contain',
  },
  nameText: {
    fontWeight: '800',
    marginTop: 6,
    color: '#111827',
    fontSize: 13,
  },
  levelText: {
    color: '#4b5563',
    fontSize: 12,
    marginTop: 2,
  },
  typeRow: {
    ...common.row,
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeBadgeText: {
    fontSize: 9,
  },
  stickyPagination: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ef5350',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
});
