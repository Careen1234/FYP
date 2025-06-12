import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (identifier: string, role: 'user' | 'provider') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'provider'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      alert('Please enter email/phone and password.');
      return;
    }

    console.log(`Logging in as ${role} with:`, identifier);
    onLogin(identifier, role);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="role-toggle">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === 'user'}
              onChange={() => setRole('user')}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="provider"
              checked={role === 'provider'}
              onChange={() => setRole('provider')}
            />
            Provider
          </label>
        </div>

        <input
          type="text"
          placeholder="Email or Phone Number"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
