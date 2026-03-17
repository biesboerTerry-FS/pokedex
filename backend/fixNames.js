const mongoose = require('mongoose');
const Pokemon = require('./models/pokemonModel');
require('dotenv').config();

async function fixNames() {
  await mongoose.connect(process.env.DATABASE_URL);
  const all = await Pokemon.find();

  for (let p of all) {
    if (p.name.includes('poke-species')) {
      // Logic to fetch correct name from sprite URL or ID if needed
      // For now, let's just make sure hyphens are replaced
      p.name = p.name.replace(/-/g, ' ');
      await p.save();
    }
  }
  console.log('Names cleaned!');
  process.exit();
}

fixNames();
