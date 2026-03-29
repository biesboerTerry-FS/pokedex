const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  displayName: {
    type: String,
    default: '',
    trim: true,
  },
  caughtPokemon: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pokemon',
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
