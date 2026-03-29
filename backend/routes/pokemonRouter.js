const express = require('express');
const Pokemon = require('../models/pokemonModel');
const Trainer = require('../models/trainerModel');

const router = express.Router();

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

function attachCaught(request, pokemonDoc) {
  const obj = pokemonDoc.toObject();
  const caught = request.trainer.caughtPokemon.some((id) =>
    id.equals(pokemonDoc._id)
  );
  obj.caught = caught;
  return obj;
}

router.get('/', async (request, response) => {
  try {
    const pokemons = await Pokemon.find();
    const caughtSet = new Set(
      request.trainer.caughtPokemon.map((id) => id.toString())
    );
    const body = pokemons.map((p) => {
      const o = p.toObject();
      o.caught = caughtSet.has(p._id.toString());
      return o;
    });
    response.json(body);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.patch('/:id/catch', async (request, response) => {
  try {
    const pokemon = await Pokemon.findById(request.params.id);
    if (pokemon == null)
      return response.status(404).json({ message: 'Pokemon not found.' });

    const trainer = await Trainer.findById(request.trainer._id);
    const pid = pokemon._id;
    const idx = trainer.caughtPokemon.findIndex((x) => x.equals(pid));

    if (idx >= 0) {
      trainer.caughtPokemon.splice(idx, 1);
      await trainer.save();
      request.trainer.caughtPokemon = trainer.caughtPokemon;
      return response.json({ caught: false });
    }

    trainer.caughtPokemon.push(pid);
    await trainer.save();
    request.trainer.caughtPokemon = trainer.caughtPokemon;
    return response.json({ caught: true });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get('/:id', getPokemon, (request, response) => {
  response.json(attachCaught(request, response.pokemon));
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
    response.status(201).json(attachCaught(request, newPokemon));
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
    response.json(attachCaught(request, updatedPokemon));
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const result = await Pokemon.findByIdAndDelete(request.params.id);
    if (!result)
      return response.status(404).json({ message: 'Pokemon not found' });

    await Trainer.updateMany(
      { caughtPokemon: request.params.id },
      { $pull: { caughtPokemon: request.params.id } }
    );

    response.json({ message: 'Deleted Pokemon' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

module.exports = router;
