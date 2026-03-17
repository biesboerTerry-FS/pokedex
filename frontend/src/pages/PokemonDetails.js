import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { getTypeStyle } from '../utils/typeStyles';

function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = '/api/v1';

  useEffect(() => {
    fetch(`${API_BASE}/pokemon/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon({ ...data, name: data.name.replace(/-/g, ' ') });
        setLoading(false);
      })
      .catch(() => navigate('/dashboard'));
  }, [id, navigate]);

  if (loading || !pokemon) return <div className="App">Loading...</div>;

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/dashboard" className="home-link">
          ← Back
        </Link>
        <h1>Entry #{id.slice(-4)}</h1>
      </header>

      <main className="detail-container">
        <div className="pokemon-card detail-card">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="pokemon-sprite"
          />
          <div className="card-info">
            <h2 className="detail-name">{pokemon.name}</h2>
            <p>Level: {pokemon.level}</p>
            <div className="type-container">
              {pokemon.types.map((t) => (
                <span key={t} style={getTypeStyle(t)}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PokemonDetail;
