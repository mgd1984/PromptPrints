import React, { useEffect } from 'react';
import netlifyAuth from '../netlifyAuth';

const NetlifyAuthClient = ({ onAuth }: { onAuth: (user: any) => void }) => {
  useEffect(() => {
    console.log('Initializing NetlifyAuth...');
    netlifyAuth.initialize((user: any) => {
      console.log('NetlifyAuth initialized:', netlifyAuth);
      if (user) {
        onAuth(user);
      }
    });
  }, [onAuth]);

  const handleSignIn = () => {
    console.log('Handling sign in...');
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