import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { getTypeStyle } from '../utils/typeStyles';

function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [editValues, setEditValues] = useState({
    name: '',
    types: '',
    level: '',
    sprite: '',
  });

  const API_BASE = '/api/v1';

  useEffect(() => {
    fetch(`${API_BASE}/pokemon/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data);
        setEditValues({
          name: data.name,
          types: data.types.join(', '),
          level: data.level,
          sprite: data.sprite,
        });
      })
      .catch(() => navigate('/dashboard'));
  }, [id, navigate]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedData = {
      ...editValues,
      types: editValues.types.split(',').map((types) => types.trim()),
    };

    const response = await fetch(`${API_BASE}/pokemon/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const newData = await response.json();
      setPokemon(newData);
      alert('Pokemon data updated successfully!');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to release this Pokémon?')) {
      await fetch(`${API_BASE}/pokemon/${id}`, { method: 'DELETE' });
      navigate('/dashboard');
    }
  };

  if (!pokemon) return <div className="App">Loading...</div>;

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/dashboard" className="home-link">
          ← Back
        </Link>
        <h1>Management Portal</h1>
      </header>

      <div className="detail-container">
        <div className="pokemon-card detail-card">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="pokemon-sprite"
          />
          <div className="card-info">
            <h3>{pokemon.name}</h3>
            <p>Level {pokemon.level}</p>
            <div className="type-container">
              {pokemon.types.map((types) => (
                <span key={types} style={getTypeStyle(types)}>
                  {types}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Update Entry</h3>
          <form onSubmit={handleUpdate}>
            <label>Pokemon Name</label>
            <input
              type="text"
              value={editValues.name}
              onChange={(event) =>
                setEditValues({ ...editValues, name: event.target.value })
              }
            />

            <label>Current Level</label>
            <input
              type="number"
              value={editValues.level}
              onChange={(event) =>
                setEditValues({ ...editValues, level: event.target.value })
              }
            />

            <label>Types (separate with commas)</label>
            <input
              type="text"
              value={editValues.types}
              onChange={(event) =>
                setEditValues({ ...editValues, types: event.target.value })
              }
            />

            <label>Sprite Image URL</label>
            <input
              type="text"
              value={editValues.sprite}
              onChange={(event) =>
                setEditValues({ ...editValues, sprite: event.target.value })
              }
            />

            <div className="button-group">
              <button type="submit" className="save-btn">
                Save
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="delete-btn"
              >
                Release
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
