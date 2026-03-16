const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  types: {
    type: [String],
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  sprite: {
    type: String,
    required: false,
    default: '',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;
