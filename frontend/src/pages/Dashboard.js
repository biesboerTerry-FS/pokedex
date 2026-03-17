import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { getTypeStyle } from '../utils/typeStyles';

function Dashboard() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [values, setValues] = useState({
    name: '',
    types: '',
    level: 1,
    sprite: '',
  });

  const API_BASE = '/api/v1';

  const getPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/pokemon`);
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    getPokemon();
  }, [getPokemon]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pokemon.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pokemon.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const typeArray = values.types.split(',').map((t) => t.trim());

    try {
      const response = await fetch(`${API_BASE}/pokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, types: typeArray }),
      });

      if (response.ok) {
        setValues({ name: '', types: '', level: 1, sprite: '' });
        getPokemon();
        setCurrentPage(1); // Return to start to see new entry
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trainer Dashboard</h1>
        <Link to="/" style={{ color: 'white', fontWeight: 'bold' }}>
          Home
        </Link>
      </header>

      <div className="dashboard-layout">
        <section className="list-section">
          <div className="list-header">
            <h2>My Pokémon ({pokemon.length})</h2>
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>

          {loading && pokemon.length === 0 ? (
            <p>Loading your team...</p>
          ) : (
            <div className="pokemon-grid">
              {currentItems.map((p) => (
                <Link
                  key={p._id}
                  to={`/pokemon/${p._id}`}
                  className="pokemon-card"
                >
                  <img
                    src={p.sprite || 'https://via.placeholder.com/100'}
                    alt={p.name}
                    className="pokemon-sprite"
                  />
                  <div className="card-info">
                    <h3>{p.name}</h3>
                    <p>Lv. {p.level}</p>
                    <div className="type-container">
                      {p.types.map((t) => (
                        <span key={t} style={getTypeStyle(t)}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="edit-form">
            <h3>Register New Pokémon</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Name:{' '}
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
                Types:{' '}
                <input
                  type="text"
                  value={values.types}
                  onChange={(e) =>
                    setValues({ ...values, types: e.target.value })
                  }
                  placeholder="Grass, Poison"
                  required
                />
              </label>
              <label>
                Level:{' '}
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
                Sprite URL:{' '}
                <input
                  type="text"
                  value={values.sprite}
                  onChange={(e) =>
                    setValues({ ...values, sprite: e.target.value })
                  }
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
