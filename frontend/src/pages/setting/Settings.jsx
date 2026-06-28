import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setLoading(true);
    setError('');
    try {
      if (updateProfile) await updateProfile({ displayName: name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || 'Could not save changes.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate('/chat')} aria-label="Back to chat">
          <BackIcon />
          <span>Back</span>
        </button>
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-body">
        <section className="settings-section">
          <h2 className="section-label">Account</h2>

          <div className="settings-field">
            <label htmlFor="settings-name">Name</label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="settings-field">
            <label>Email</label>
            <input type="email" value={user?.email || ''} disabled />
          </div>

          {error && <p className="settings-error">{error}</p>}

          <button className="btn-save" onClick={handleSave} disabled={loading}>
            {saved ? 'Saved' : loading ? 'Saving...' : 'Save changes'}
          </button>
        </section>

        <section className="settings-section">
          <h2 className="section-label">Session</h2>
          <button className="btn-logout" onClick={handleLogout}>
            Sign out
          </button>
        </section>
      </div>
    </div>
  );
}
