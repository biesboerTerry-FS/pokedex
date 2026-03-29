import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { apiFetch, togglePokemonCatch } from '../api/client';
import PokeballIcon from '../components/PokeballIcon';
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

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await apiFetch(`/pokemon/${id}`);
        if (cancelled) return;
        setPokemon(data);
        setEditValues({
          name: data.name,
          types: data.types.join(', '),
          level: data.level,
          sprite: data.sprite,
        });
      } catch {
        navigate('/dashboard');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedData = {
      ...editValues,
      types: editValues.types.split(',').map((types) => types.trim()),
    };

    try {
      const newData = await apiFetch(`/pokemon/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedData),
      });
      setPokemon(newData);
      alert('Pokemon data updated successfully!');
    } catch (err) {
      alert(err.message || 'Update failed.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to release this Pokémon?')) {
      try {
        await apiFetch(`/pokemon/${id}`, { method: 'DELETE' });
        navigate('/dashboard');
      } catch (err) {
        alert(err.message || 'Delete failed.');
      }
    }
  };

  const handleToggleCatch = async () => {
    try {
      const result = await togglePokemonCatch(id);
      setPokemon((prev) => (prev ? { ...prev, caught: result.caught } : prev));
    } catch (err) {
      alert(err.message || 'Could not update catch status.');
    }
  };

  if (!pokemon) return <div className="App">Loading...</div>;

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/dashboard" className="home-link">
          ← Back
        </Link>
        <h1>Details</h1>
      </header>

      <div className="detail-container">
        <div className="pokemon-card detail-card detail-card-wrap">
          <button
            type="button"
            className="pokeball-toggle pokeball-toggle--detail"
            onClick={handleToggleCatch}
            aria-label={
              pokemon.caught ? 'Mark as not caught' : 'Mark as caught'
            }
          >
            <PokeballIcon caught={Boolean(pokemon.caught)} size={36} />
          </button>
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
