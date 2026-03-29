const jwt = require('jsonwebtoken');
const Trainer = require('../models/trainerModel');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

/**
 * Requires `Authorization: Bearer <token>`. Attaches the Trainer document to `req.trainer`.
 */
async function requireAuth(request, response, next) {
  const header = request.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication required.' });
  }

  const token = header.slice(7).trim();
  if (!token) {
    return response.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    const trainerId = payload.sub;
    if (!trainerId) {
      return response.status(401).json({ message: 'Invalid token.' });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return response.status(401).json({ message: 'Trainer not found.' });
    }

    request.trainer = trainer;
    next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = { requireAuth, getJwtSecret };
