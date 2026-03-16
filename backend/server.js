const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const pokemonRouter = require('./routes/pokemonRouter');
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Pokedex Database'));

// API Routes
app.use('/api/v1/pokemon', pokemonRouter);

// --- SERVE FRONTEND IN PRODUCTION ---
if (process.env.NODE_ENV === 'production') {
  // Set static folder (where React build lives)
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Any route that is NOT an API route should serve the React index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Pokedex Server running on port ${PORT}`));
