import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { getTypeStyle } from '../utils/typeStyles';

function Dashboard() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // State for Add New Pokemon Form
  const [newPoke, setNewPoke] = useState({
    name: '',
    types: '',
    level: 5,
    sprite: '',
  });

  const API_BASE = '/api/v1';

  const getPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/pokemon`);
      const data = await response.json();
      const cleanedData = data.map((p) => ({
        ...p,
        name: p.name.replace(/-/g, ' '),
      }));
      setPokemon(cleanedData);
      setFilteredPokemon(cleanedData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    getPokemon();
  }, [getPokemon]);

  useEffect(() => {
    const results = pokemon.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(results);
    setCurrentPage(1);
  }, [searchTerm, pokemon]);

  const handleAddNew = async (e) => {
    e.preventDefault();
    const payload = {
      ...newPoke,
      types: newPoke.types.split(',').map((t) => t.trim()),
    };

    try {
      const res = await fetch(`${API_BASE}/pokemon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setNewPoke({ name: '', types: '', level: 5, sprite: '' });
        getPokemon();
        alert('New Pokemon Added!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPokemon.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trainer Dashboard</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              X
            </button>
          )}
        </div>
        <Link to="/" className="home-link">
          Home
        </Link>
      </header>

      <div className="dashboard-layout">
        <section className="list-section">
          {/* Results and Pagination on same line */}
          <div className="list-header">
            <h2>Results ({filteredPokemon.length})</h2>
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                {currentPage} / {totalPages || 1}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="pokemon-grid">
            {currentItems.map((p) => (
              <Link
                key={p._id}
                to={`/pokemon/${p._id}`}
                className="pokemon-card"
              >
                <img src={p.sprite} alt={p.name} className="pokemon-sprite" />
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
        </section>

        {/* Form on the right side */}
        <aside className="form-section">
          <h3>Add New Pokemon</h3>
          <form onSubmit={handleAddNew}>
            <label>Name</label>
            <input
              type="text"
              required
              value={newPoke.name}
              onChange={(e) => setNewPoke({ ...newPoke, name: e.target.value })}
            />
            <label>Level</label>
            <input
              type="number"
              required
              value={newPoke.level}
              onChange={(e) =>
                setNewPoke({ ...newPoke, level: e.target.value })
              }
            />
            <label>Types (Comma separated)</label>
            <input
              type="text"
              placeholder="Fire, Flying"
              required
              value={newPoke.types}
              onChange={(e) =>
                setNewPoke({ ...newPoke, types: e.target.value })
              }
            />
            <label>Sprite Image URL</label>
            <input
              type="text"
              value={newPoke.sprite}
              onChange={(e) =>
                setNewPoke({ ...newPoke, sprite: e.target.value })
              }
            />
            <button
              type="submit"
              className="save-btn"
              style={{ marginTop: '20px' }}
            >
              Add to Collection
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
