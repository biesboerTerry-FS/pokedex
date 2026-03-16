const express = require('express');
const router = express.Router();
const Pokemon = require('../models/pokemonModel');

const getPokemon = async (req, res, next) => {
  let pokemon;
  try {
    pokemon = await Pokemon.findById(req.params.id);
    if (pokemon == null)
      return res.status(404).json({ message: 'Pokemon not found.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.pokemon = pokemon;
  next();
};

router.get('/', async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', getPokemon, (req, res) => {
  res.json(res.pokemon);
});

router.post('/', async (req, res) => {
  const typeArray = Array.isArray(req.body.types)
    ? req.body.types
    : String(req.body.types || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  const pokemon = new Pokemon({
    name: req.body.name,
    types: typeArray,
    level: req.body.level,
    sprite: req.body.sprite,
  });
  try {
    const newPokemon = await pokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', getPokemon, async (req, res) => {
  if (req.body.name != null) res.pokemon.name = req.body.name;
  if (req.body.sprite != null) res.pokemon.sprite = req.body.sprite;
  if (req.body.level != null) res.pokemon.level = req.body.level;
  if (req.body.types != null) {
    res.pokemon.types = Array.isArray(req.body.types)
      ? req.body.types
      : String(req.body.types)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
  }
  try {
    const updatedPokemon = await res.pokemon.save();
    res.json(updatedPokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Pokemon.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Pokemon not found' });
    res.json({ message: 'Deleted Pokemon' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
