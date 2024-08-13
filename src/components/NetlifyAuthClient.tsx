import React, { useEffect } from 'react';
import netlifyAuth from '../netlifyAuth.js';

const NetlifyAuthClient = ({ onAuth }: { onAuth: (user: any) => void }) => {
  useEffect(() => {
    netlifyAuth.initialize((user: any) => {
      if (user) {
        onAuth(user);
      }
    });
  }, [onAuth]);

  const handleSignIn = () => {
    netlifyAuth.authenticate((user: any) => {
      console.log('Logged in user:', user);
      onAuth(user);
    });
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={handleSignIn}>Sign In with Netlify Identity</button>
    </div>
  );
};

export default NetlifyAuthClient;