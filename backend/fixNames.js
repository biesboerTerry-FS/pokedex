const mongoose = require('mongoose');
const Pokemon = require('./models/pokemonModel');
require('dotenv').config();

async function fixNames() {
  await mongoose.connect(process.env.DATABASE_URL);
  const all = await Pokemon.find();

  for (let pokemon of all) {
    if (pokemon.name.includes('poke-species')) {
      pokemon.name = pokemon.name.replace(/-/g, ' ');
      await pokemon.save();
    }
  }
  console.log('Names cleaned!');
  process.exit();
}

fixNames();
