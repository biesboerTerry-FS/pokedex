import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { getTypeStyle } from '../utils/typeStyles';

function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    types: '',
    level: 1,
    sprite: '',
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = '/api/v1';

  // Helper to extract raw URL from HTML snippets if pasted accidentally
  const cleanUrl = (url) => {
    if (!url) return '';
    const match = url.match(/src=["']([^"']+)["']/);
    return match ? match[1] : url.replace(/\[\/?IMG\]/gi, '').trim();
  };

  useEffect(() => {
    const fetchPoke = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/pokemon/${id}`);
        if (!res.ok) {
          navigate('/dashboard');
          return;
        }
        const data = await res.json();
        setValues({
          name: data.name,
          types: data.types.join(', '),
          level: data.level,
          sprite: data.sprite || '',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPoke();
  }, [id, API_BASE, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanedSprite = cleanUrl(values.sprite);
    const typeArray = values.types.split(',').map((t) => t.trim());

    try {
      await fetch(`${API_BASE}/pokemon/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          sprite: cleanedSprite,
          types: typeArray,
          level: Number(values.level),
        }),
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this Pokémon?')) {
      setLoading(true);
      try {
        await fetch(`${API_BASE}/pokemon/${id}`, { method: 'DELETE' });
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{values.name} Profile</h1>
        <Link to="/dashboard" style={{ color: 'white' }}>
          Back to Dashboard
        </Link>
      </header>

      <main className="dashboard-layout" style={{ marginTop: '20px' }}>
        {/* LEFT SIDE (2/3): Display Details */}
        <section className="list-section" style={{ textAlign: 'center' }}>
          <div
            className="pokemon-card-large"
            style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              border: '4px solid #3c5aa6',
            }}
          >
            <img
              src={
                values.sprite && values.sprite.trim().length > 5
                  ? values.sprite
                  : 'https://via.placeholder.com/300'
              }
              alt={values.name}
              style={{ width: '250px', height: '250px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300';
              }}
            />
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0', color: '#333' }}>
              {values.name}
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              <strong>Level:</strong> {values.level}
            </p>
            <div style={{ marginTop: '15px' }}>
              {values.types.split(',').map((t, i) => (
                <span
                  key={i}
                  className="type-pill"
                  style={{
                    ...getTypeStyle(t),
                    fontSize: '1rem',
                    padding: '8px 15px',
                    margin: '0 5px',
                  }}
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT SIDE (1/3): Edit Form */}
        <section className="form-section">
          <div className="edit-form">
            <h3>Edit Pokémon</h3>
            <form onSubmit={handleUpdate}>
              <label>
                Name:
                <input
                  type="text"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
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
                />
              </label>
              <label>
                Sprite URL:
                <input
                  type="text"
                  value={values.sprite}
                  placeholder="Paste direct image link"
                  onChange={(e) =>
                    setValues({ ...values, sprite: e.target.value })
                  }
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
            <button
              onClick={handleDelete}
              className="delete-btn"
              style={{
                backgroundColor: '#ef5350',
                marginTop: '20px',
                width: '100%',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Delete Pokemon
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PokemonDetail;
