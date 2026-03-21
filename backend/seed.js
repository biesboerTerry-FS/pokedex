const mongoose = require('mongoose');
const Pokemon = require('./models/pokemonModel');
require('dotenv').config();

const seedDB = async () => {
  try {
    const uri = process.env.DATABASE_URL;
    await mongoose.connect(uri);
    await Pokemon.deleteMany({});

    console.log('Fetching 1024 Pokemon from PokeAPI...');
    const pokemon = [];

    for (let index = 1; index <= 1024; index++) {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${index}`
        );
        const data = await response.json();

        pokemon.push({
          name:
            data.name.charAt(0).toUpperCase() +
            data.name.slice(1).replace(/-/g, ' '),
          types: data.types.map(
            (type) =>
              type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
          ),
          level: Math.floor(Math.random() * 50) + 1,
          sprite:
            data.sprites.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`,
        });

        if (index % 100 === 0) console.log(`Buffered ${index} Pokémon...`);
      } catch (error) {
        console.error(`Skip ID ${i}: ${error.message}`);
      }
    }

    await Pokemon.insertMany(pokemon);
    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
