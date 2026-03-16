const TYPE_STYLES = {
  normal: { backgroundColor: '#a8a77a', color: '#1f1f1f' },
  fire: { backgroundColor: '#ee8130', color: '#ffffff' },
  water: { backgroundColor: '#6390f0', color: '#ffffff' },
  grass: { backgroundColor: '#7ac74c', color: '#1f1f1f' },
  electric: { backgroundColor: '#f7d02c', color: '#1f1f1f' },
  ice: { backgroundColor: '#96d9d6', color: '#1f1f1f' },
  fighting: { backgroundColor: '#c22e28', color: '#ffffff' },
  poison: { backgroundColor: '#a33ea1', color: '#ffffff' },
  ground: { backgroundColor: '#e2bf65', color: '#1f1f1f' },
  flying: { backgroundColor: '#a98ff3', color: '#ffffff' },
  psychic: { backgroundColor: '#f95587', color: '#ffffff' },
  bug: { backgroundColor: '#a6b91a', color: '#1f1f1f' },
  rock: { backgroundColor: '#b6a136', color: '#1f1f1f' },
  ghost: { backgroundColor: '#735797', color: '#ffffff' },
  dragon: { backgroundColor: '#6f35fc', color: '#ffffff' },
  dark: { backgroundColor: '#705746', color: '#ffffff' },
  steel: { backgroundColor: '#b7b7ce', color: '#1f1f1f' },
  fairy: { backgroundColor: '#d685ad', color: '#1f1f1f' },
};

export function getTypeStyle(type) {
  const normalizedType = String(type).trim().toLowerCase();

  return (
    TYPE_STYLES[normalizedType] || {
      backgroundColor: '#eeeeee',
      color: '#1f1f1f',
    }
  );
}
