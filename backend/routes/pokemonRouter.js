const express = require('express');
const router = express.Router();
const Pokemon = require('../models/pokemonModel');

const getPokemon = async (request, response, next) => {
  let pokemon;
  try {
    pokemon = await Pokemon.findById(request.params.id);
    if (pokemon == null)
      return response.status(404).json({ message: 'Pokemon not found.' });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
  response.pokemon = pokemon;
  next();
};

router.get('/', async (request, response) => {
  try {
    const pokemons = await Pokemon.find();
    response.json(pokemons);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get('/:id', getPokemon, (request, response) => {
  response.json(response.pokemon);
});

router.post('/', async (request, response) => {
  const typeArray = Array.isArray(request.body.types)
    ? request.body.types
    : String(request.body.types || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  const pokemon = new Pokemon({
    name: request.body.name,
    types: typeArray,
    level: request.body.level,
    sprite: request.body.sprite,
  });
  try {
    const newPokemon = await pokemon.save();
    response.status(201).json(newPokemon);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

router.patch('/:id', getPokemon, async (request, response) => {
  if (request.body.name != null) response.pokemon.name = request.body.name;
  if (request.body.sprite != null)
    response.pokemon.sprite = request.body.sprite;
  if (request.body.level != null) response.pokemon.level = request.body.level;
  if (request.body.types != null) {
    response.pokemon.types = Array.isArray(request.body.types)
      ? request.body.types
      : String(request.body.types)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
  }
  try {
    const updatedPokemon = await response.pokemon.save();
    response.json(updatedPokemon);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const result = await Pokemon.findByIdAndDelete(request.params.id);
    if (!result)
      return response.status(404).json({ message: 'Pokemon not found' });
    response.json({ message: 'Deleted Pokemon' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

module.exports = router;
