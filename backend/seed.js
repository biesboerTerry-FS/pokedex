const path = require('path');
const mongoose = require('mongoose');
const Pokemon = require('./models/pokemonModel');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const seedData = [
  {
    name: 'Bulbasaur',
    types: ['Grass', 'Poison'],
    level: 5,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
  {
    name: 'Ivysaur',
    types: ['Grass', 'Poison'],
    level: 16,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
  },
  {
    name: 'Venusaur',
    types: ['Grass', 'Poison'],
    level: 32,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
  },
  {
    name: 'Charmander',
    types: ['Fire'],
    level: 5,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  },
  {
    name: 'Charmeleon',
    types: ['Fire'],
    level: 16,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png',
  },
  {
    name: 'Charizard',
    types: ['Fire', 'Flying'],
    level: 36,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
  },
  {
    name: 'Squirtle',
    types: ['Water'],
    level: 5,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
  },
  {
    name: 'Wartortle',
    types: ['Water'],
    level: 16,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png',
  },
  {
    name: 'Blastoise',
    types: ['Water'],
    level: 36,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
  },
  {
    name: 'Caterpie',
    types: ['Bug'],
    level: 3,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png',
  },
  {
    name: 'Metapod',
    types: ['Bug'],
    level: 7,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png',
  },
  {
    name: 'Butterfree',
    types: ['Bug', 'Flying'],
    level: 12,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png',
  },
  {
    name: 'Weedle',
    types: ['Bug', 'Poison'],
    level: 3,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png',
  },
  {
    name: 'Kakuna',
    types: ['Bug', 'Poison'],
    level: 7,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png',
  },
  {
    name: 'Beedrill',
    types: ['Bug', 'Poison'],
    level: 10,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png',
  },
  {
    name: 'Pidgey',
    types: ['Normal', 'Flying'],
    level: 5,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png',
  },
  {
    name: 'Pidgeotto',
    types: ['Normal', 'Flying'],
    level: 18,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png',
  },
  {
    name: 'Pidgeot',
    types: ['Normal', 'Flying'],
    level: 36,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png',
  },
  {
    name: 'Rattata',
    types: ['Normal'],
    level: 4,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png',
  },
  {
    name: 'Raticate',
    types: ['Normal'],
    level: 20,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png',
  },
  {
    name: 'Spearow',
    types: ['Normal', 'Flying'],
    level: 6,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png',
  },
  {
    name: 'Fearow',
    types: ['Normal', 'Flying'],
    level: 20,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png',
  },
  {
    name: 'Ekans',
    types: ['Poison'],
    level: 8,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png',
  },
  {
    name: 'Arbok',
    types: ['Poison'],
    level: 22,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png',
  },
  {
    name: 'Pikachu',
    types: ['Electric'],
    level: 10,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
  {
    name: 'Raichu',
    types: ['Electric'],
    level: 30,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',
  },
  {
    name: 'Sandshrew',
    types: ['Ground'],
    level: 12,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png',
  },
  {
    name: 'Sandslash',
    types: ['Ground'],
    level: 22,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/28.png',
  },
  {
    name: 'Nidoran♀',
    types: ['Poison'],
    level: 10,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png',
  },
  {
    name: 'Nidorina',
    types: ['Poison'],
    level: 16,
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/30.png',
  },
];

const seedDB = async () => {
  try {
    const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/pokedex';
    await mongoose.connect(uri);
    await Pokemon.deleteMany({});

    const typePool = [
      'Fire',
      'Water',
      'Grass',
      'Electric',
      'Psychic',
      'Ice',
      'Dragon',
      'Dark',
      'Fairy',
    ];
    const pokes = [];

    for (let i = 1; i <= 963; i++) {
      pokes.push({
        name: `Poke-Species ${i}`,
        types: [typePool[Math.floor(Math.random() * typePool.length)]],
        level: Math.floor(Math.random() * 99) + 1,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`,
      });
    }

    await Pokemon.insertMany(pokes);
    console.log('Successfully Seeded 396 Pokemon!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
