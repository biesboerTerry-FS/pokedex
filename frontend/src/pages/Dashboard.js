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

  const API_BASE = '/api/v1';

  const getPokemon = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/pokemon`);
      const data = await response.json();
      // Clean names: replace hyphens with spaces and capitalize
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

  // Search Logic
  useEffect(() => {
    const results = pokemon.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(results);
    setCurrentPage(1); // Reset to page 1 on search
  }, [searchTerm, pokemon]);

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
        </div>
        <Link to="/" className="home-link">
          Home
        </Link>
      </header>

      <div className="dashboard-layout">
        <section className="list-section">
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
      </div>
    </div>
  );
}

export default Dashboard;
