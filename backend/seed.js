const mongoose = require('mongoose');
const Pokemon = require('./models/pokemonModel');
require('dotenv').config();

const seedDB = async () => {
  try {
    const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/pokedex';
    await mongoose.connect(uri);
    await Pokemon.deleteMany({});

    console.log(
      'Fetching real data for 1024 Pokemon... this may take a minute.'
    );

    const pokes = [];
    // We fetch in chunks to avoid slamming the API
    for (let i = 1; i <= 1024; i++) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const data = await response.json();

        pokes.push({
          name: data.name,
          types: data.types.map((t) => t.type.name),
          level: Math.floor(Math.random() * 50) + 1,
          sprite:
            data.sprites.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`,
        });

        if (i % 100 === 0) console.log(`Downloaded ${i} Pokémon...`);
      } catch (err) {
        console.error(`Error fetching ID ${i}:`, err.message);
      }
    }

    await Pokemon.insertMany(pokes);
    console.log('Successfully seeded 1024 Pokémon with real names and types!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
