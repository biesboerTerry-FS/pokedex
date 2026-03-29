import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { apiFetch, togglePokemonCatch } from '../api/client';
import PokeballIcon from '../components/PokeballIcon';
import { useAuth } from '../context/AuthContext';
import { getTypeStyle } from '../utils/typeStyles';

function Dashboard() {
  const { logout, trainer } = useAuth();
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 32;

  const [newPokemon, setNewPokemon] = useState({
    name: '',
    types: '',
    level: 5,
    sprite: '',
  });

  const getPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/pokemon');
      const cleanedData = data.map((item) => ({
        ...item,
        name: item.name.replace(/-/g, ' '),
      }));
      setPokemon(cleanedData);
      setFilteredPokemon(cleanedData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPokemon();
  }, [getPokemon]);

  useEffect(() => {
    const results = pokemon.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(results);
    setCurrentPage(1);
  }, [searchTerm, pokemon]);

  const handleAddNew = async (e) => {
    e.preventDefault();
    const payload = {
      ...newPokemon,
      types: newPokemon.types.split(',').map((t) => t.trim()),
    };

    try {
      await apiFetch('/pokemon', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setNewPokemon({ name: '', types: '', level: 5, sprite: '' });
      getPokemon();
      alert('New Pokemon Added!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not add Pokémon.');
    }
  };

  const handleToggleCatch = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await togglePokemonCatch(id);
      setPokemon((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, caught: result.caught } : p
        )
      );
    } catch (err) {
      alert(err.message || 'Could not update catch status.');
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
            onChange={(event) => setSearchTerm(event.target.value)}
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
        <div className="header-links">
          <span className="trainer-greeting">
            {trainer?.displayName || 'Trainer'}
          </span>
          <Link to="/" className="home-link">
            Home
          </Link>
          <button type="button" className="link-button" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <section className="list-section">
          <div className="list-header">
            <h2>Results ({filteredPokemon.length})</h2>
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                Prev
              </button>
              <span>
                {currentPage} / {totalPages || 1}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="pokemon-grid">
            {loading && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                Loading Pokémon…
              </p>
            )}
            {!loading &&
              currentItems.map((item) => (
              <div key={item._id} className="pokemon-card-wrap">
                <button
                  type="button"
                  className="pokeball-toggle"
                  onClick={(e) => handleToggleCatch(e, item._id)}
                  aria-label={
                    item.caught ? 'Mark as not caught' : 'Mark as caught'
                  }
                  title={item.caught ? 'Caught' : 'Not caught'}
                >
                  <PokeballIcon caught={Boolean(item.caught)} size={32} />
                </button>
                <Link to={`/pokemon/${item._id}`} className="pokemon-card">
                  <img
                    src={item.sprite}
                    alt={item.name}
                    className="pokemon-sprite"
                  />
                  <div className="card-info">
                    <h3>{item.name}</h3>
                    <p>Lv. {item.level}</p>
                    <div className="type-container">
                      {item.types.map((types) => (
                        <span key={types} style={getTypeStyle(types)}>
                          {types}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <aside className="form-section">
          <h3>Add New Pokemon</h3>
          <form onSubmit={handleAddNew}>
            <label>Name</label>
            <input
              type="text"
              required
              value={newPokemon.name}
              onChange={(event) =>
                setNewPokemon({ ...newPokemon, name: event.target.value })
              }
            />
            <label>Level</label>
            <input
              type="number"
              required
              value={newPokemon.level}
              onChange={(event) =>
                setNewPokemon({ ...newPokemon, level: event.target.value })
              }
            />
            <label>Types (Comma separated)</label>
            <input
              type="text"
              placeholder="Fire, Flying"
              required
              value={newPokemon.types}
              onChange={(event) =>
                setNewPokemon({ ...newPokemon, types: event.target.value })
              }
            />
            <label>Sprite Image URL</label>
            <input
              type="text"
              value={newPokemon.sprite}
              onChange={(event) =>
                setNewPokemon({ ...newPokemon, sprite: event.target.value })
              }
            />
            <button
              type="submit"
              className="save-btn"
              style={{ marginTop: '20px' }}
            >
              Add to Pokedex
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
