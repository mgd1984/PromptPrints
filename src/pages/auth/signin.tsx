import React, { useEffect, useState } from 'react';
import netlifyAuth from '../../netlifyAuth.js';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated);
  const [user, setUser] = useState(null);

  useEffect(() => {
    netlifyAuth.initialize((user: any) => {
      setLoggedIn(!!user);
      setUser(user);
    });
  }, [loggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    netlifyAuth.initialize();

    (netlifyAuth as any).login(email, password, true)
      .then((user: any) => {
        console.log('User logged in:', user);
        setLoggedIn(true);
        setUser(user);
      })
      .catch((err: any) => {
        console.error('Failed to log in:', err);
      });
  };

  const login = () => {
    netlifyAuth.authenticate((user: any) => {
      setLoggedIn(!!user);
      setUser(user);
    });
  };

  const logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false);
      setUser(null);
    });
  };

  return (
    <div>
      <h1>Sign In</h1>
      {loggedIn ? (
        <div>
          <p>You are logged in!</p>
          {user && <p>Welcome {(user as any)?.user_metadata?.full_name}!</p>}
          <button onClick={logout}>Log out here</button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Sign In</button>
          </form>
          <button onClick={login}>Log in here</button>
        </div>
      )}
    </div>
  );
}