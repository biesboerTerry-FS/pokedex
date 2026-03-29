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
const authRouter = require('./routes/authRouter');
const { requireAuth } = require('./middleware/authMiddleware');
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Pokedex Database'));

app.get('/health', (request, response) => {
  response.json({ ok: true });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/pokemon', requireAuth, pokemonRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Pokedex Server running on port ${PORT}`));
