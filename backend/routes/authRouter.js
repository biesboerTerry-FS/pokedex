const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Trainer = require('../models/trainerModel');
const { requireAuth, getJwtSecret } = require('../middleware/authMiddleware');

const router = express.Router();
const SALT_ROUNDS = 10;

function signTrainerToken(trainerId) {
  return jwt.sign({ sub: trainerId }, getJwtSecret(), { expiresIn: '7d' });
}

router.post('/register', async (request, response) => {
  try {
    const email = String(request.body.email || '')
      .trim()
      .toLowerCase();
    const password = String(request.body.password || '');
    const displayName = String(request.body.displayName || '').trim();

    if (!email || !password) {
      return response
        .status(400)
        .json({ message: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return response
        .status(400)
        .json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await Trainer.findOne({ email });
    if (existing) {
      return response.status(409).json({ message: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const trainer = await Trainer.create({
      email,
      passwordHash,
      displayName: displayName || 'Trainer',
    });

    const token = signTrainerToken(trainer._id);
    response.status(201).json({
      token,
      trainer: {
        id: trainer._id,
        email: trainer.email,
        displayName: trainer.displayName,
      },
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.post('/login', async (request, response) => {
  try {
    const email = String(request.body.email || '')
      .trim()
      .toLowerCase();
    const password = String(request.body.password || '');

    if (!email || !password) {
      return response
        .status(400)
        .json({ message: 'Email and password are required.' });
    }

    const trainer = await Trainer.findOne({ email }).select('+passwordHash');
    if (!trainer) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, trainer.passwordHash);
    if (!match) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signTrainerToken(trainer._id);
    response.json({
      token,
      trainer: {
        id: trainer._id,
        email: trainer.email,
        displayName: trainer.displayName,
      },
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get('/me', requireAuth, (request, response) => {
  response.json({
    id: request.trainer._id,
    email: request.trainer.email,
    displayName: request.trainer.displayName,
  });
});

module.exports = router;
