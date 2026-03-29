import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, login, register, logout, trainer, loading } =
    useAuth();
  const navigate = useNavigate();
  const [panel, setPanel] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      setPanel(null);
      resetForm();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(email, password, displayName);
      setPanel(null);
      resetForm();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div style={{ padding: 60, textAlign: 'center' }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokédex Master</h1>
        {isAuthenticated ? (
          <div className="home-header-actions">
            <span className="trainer-greeting">
              Hi, {trainer?.displayName || 'Trainer'}!
            </span>
            <Link
              to="/dashboard"
              style={{
                color: 'white',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              Dashboard
            </Link>
            <button type="button" className="link-button" onClick={logout}>
              Log out
            </button>
          </div>
        ) : null}
      </header>
      <main>
        <img src="/banner.png" alt="Pokemon Banner" className="hero-banner" />
        <div style={{ padding: '40px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <h2>Welcome, Trainer!</h2>
          <p>
            Organize your collection, track levels, and manage sprites for your
            entire roster.
          </p>

          {isAuthenticated ? (
            <Link to="/dashboard">
              <button
                type="button"
                style={{
                  fontSize: '1.2rem',
                  padding: '15px 30px',
                  background: 'var(--poke-red)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Open Pokédex
              </button>
            </Link>
          ) : (
            <>
              <div className="home-auth-buttons">
                <button
                  type="button"
                  className="primary-action-btn"
                  onClick={() => {
                    resetForm();
                    setPanel('login');
                  }}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className="secondary-action-btn"
                  onClick={() => {
                    resetForm();
                    setPanel('register');
                  }}
                >
                  Sign up
                </button>
              </div>

              {panel === 'login' && (
                <form className="auth-form" onSubmit={handleLogin}>
                  <h3>Trainer sign in</h3>
                  {error ? <p className="auth-error">{error}</p> : null}
                  <label>
                    Email
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </label>
                  <button type="submit" disabled={busy} className="save-btn">
                    {busy ? 'Signing in…' : 'Sign in'}
                  </button>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setPanel(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </form>
              )}

              {panel === 'register' && (
                <form className="auth-form" onSubmit={handleRegister}>
                  <h3>Create trainer account</h3>
                  {error ? <p className="auth-error">{error}</p> : null}
                  <label>
                    Display name
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ash"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Password (min. 6 characters)
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </label>
                  <button type="submit" disabled={busy} className="save-btn">
                    {busy ? 'Creating…' : 'Create account'}
                  </button>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setPanel(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
