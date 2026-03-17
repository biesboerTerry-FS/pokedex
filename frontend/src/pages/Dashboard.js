import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { getTypeStyle } from '../utils/typeStyles';

function Dashboard() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: '',
    types: '',
    level: 1,
    sprite: '',
  });

  const API_BASE = '/api/v1';

  const cleanUrl = (url) => {
    if (!url) return '';
    const match = url.match(/src=["']([^"']+)["']/);
    return match ? match[1] : url.replace(/\[\/?IMG\]/gi, '').trim();
  };

  const getPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/pokemon`);
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    getPokemon();
  }, [getPokemon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanedSprite = cleanUrl(values.sprite);
    const typeArray = values.types.split(',').map((t) => t.trim());

    try {
      await fetch(`${API_BASE}/pokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          sprite: cleanedSprite,
          types: typeArray,
        }),
      });
      setValues({ name: '', types: '', level: 1, sprite: '' });
      getPokemon();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trainer Dashboard</h1>
        <Link to="/" style={{ color: 'white' }}>
          Home
        </Link>
      </header>
      <div className="dashboard-layout">
        <section className="list-section">
          <h2>My Pokémon</h2>
          <div className="pokemon-grid">
            {pokemon.map((p) => {
              // Logic for circular types if there are more than 3
              const useCircles = p.types.length > 3;

              return (
                <Link
                  key={p._id}
                  to={`/pokemon/${p._id}`}
                  className="quadrant-card"
                >
                  {/* Quadrants 1, 2, 4, 5: Image */}
                  <div className="card-image-area">
                    <img
                      src={p.sprite || 'https://via.placeholder.com/80'}
                      alt={p.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80';
                      }}
                    />
                  </div>

                  {/* Quadrant 3: Name */}
                  <div className="card-name-area">
                    <h4>{p.name}</h4>
                  </div>

                  {/* Quadrant 6: Level */}
                  <div className="card-level-area">
                    <span>Lv. {p.level}</span>
                  </div>

                  {/* Quadrants 7, 8, 9: Types */}
                  <div className="card-types-area">
                    {p.types.map((t) => (
                      <span
                        key={t}
                        className={
                          useCircles ? 'type-circle' : 'type-pill-small'
                        }
                        style={getTypeStyle(t)}
                        title={useCircles ? t : ''}
                      >
                        {useCircles ? '' : t}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="form-section">
          <div className="edit-form">
            <h3>Register New Pokémon</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Types:
                <input
                  type="text"
                  value={values.types}
                  onChange={(e) =>
                    setValues({ ...values, types: e.target.value })
                  }
                  placeholder="Water, Ice"
                  required
                />
              </label>
              <label>
                Level:
                <input
                  type="number"
                  value={values.level}
                  onChange={(e) =>
                    setValues({ ...values, level: Number(e.target.value) })
                  }
                  required
                />
              </label>
              <label>
                Sprite URL:
                <input
                  type="text"
                  value={values.sprite}
                  onChange={(e) =>
                    setValues({ ...values, sprite: e.target.value })
                  }
                  placeholder="Paste direct link or <img> tag"
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add to Database'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
