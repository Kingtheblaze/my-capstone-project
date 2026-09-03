import React, { useState } from 'react';

export function SettingsForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [notifyDigest, setNotifyDigest] = useState('daily');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) {
      setError('Please fill in required fields');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Settings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {submitted && <p style={{ color: 'green' }}>Settings saved!</p>}
      
      <div>
        <label>Username</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
      </div>

      <div>
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      <div>
        <label>Notification Digest</label>
        <select value={notifyDigest} onChange={(e) => setNotifyDigest(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div>
        <label>
          <input 
            type="checkbox" 
            checked={marketingOptIn} 
            onChange={(e) => setMarketingOptIn(e.target.checked)} 
          />
          Opt in to marketing emails
        </label>
      </div>

      <button type="submit">Save Settings</button>
    </form>
  );
}
