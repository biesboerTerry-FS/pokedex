import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokédex Master</h1>
        <Link to="/dashboard" style={{ color: 'white', fontWeight: 'bold' }}>
          Dashboard
        </Link>
      </header>
      <main>
        <img src="/banner.png" alt="Pokemon Banner" className="hero-banner" />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Welcome, Trainer!</h2>
          <p>
            Organize your collection, track levels, and manage sprites for your
            entire roster.
          </p>
          <Link to="/dashboard">
            <button style={{ fontSize: '1.2rem', padding: '15px 30px' }}>
              Enter Database
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
