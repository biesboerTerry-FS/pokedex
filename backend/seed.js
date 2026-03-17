const mongoose = require('mongoose');
const Pokemon = require('./models/pokemonModel');
require('dotenv').config();

const seedDB = async () => {
  try {
    const uri = process.env.DATABASE_URL;
    await mongoose.connect(uri);
    await Pokemon.deleteMany({});

    console.log('Fetching 1024 Pokemon from PokeAPI...');
    const pokes = [];

    for (let i = 1; i <= 1024; i++) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const data = await response.json();

        // This ensures names are "Pikachu" instead of "poke-species-25"
        pokes.push({
          name:
            data.name.charAt(0).toUpperCase() +
            data.name.slice(1).replace(/-/g, ' '),
          types: data.types.map(
            (t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
          ),
          level: Math.floor(Math.random() * 50) + 1,
          sprite:
            data.sprites.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`,
        });

        if (i % 100 === 0) console.log(`Buffered ${i} Pokémon...`);
      } catch (e) {
        console.error(`Skip ID ${i}: ${e.message}`);
      }
    }

    await Pokemon.insertMany(pokes);
    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
