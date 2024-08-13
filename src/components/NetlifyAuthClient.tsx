import React, { useEffect } from 'react';
import netlifyAuth from '../netlifyAuth';

const NetlifyAuthClient = ({ onAuth }: { onAuth: (user: any) => void }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      netlifyAuth.initialize((user: any) => {
        if (user) {
          onAuth(user);
        }
      });
    }
  }, [onAuth]);

  const handleSignIn = () => {
    if (typeof window !== 'undefined') {
      netlifyAuth.authenticate((user: any) => {
        onAuth(user);
      });
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={handleSignIn}>Sign In with Netlify Identity</button>
    </div>
  );
};

export default NetlifyAuthClient;