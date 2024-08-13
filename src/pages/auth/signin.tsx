import React, { useEffect, useState } from 'react';
import netlifyAuth from '../../netlifyAuth.js';

export default function SignIn() {
  useEffect(() => {
    netlifyAuth.initialize((user: any) => {
      if (user) {
        // Redirect to home or another page after successful sign-in
        window.location.href = '/';
      }
    });
  }, []);

  const handleSignIn = () => {
    netlifyAuth.authenticate((user: any) => {
      console.log('Logged in user:', user);
      window.location.href = '/';
    });
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={handleSignIn}>Sign In with Netlify Identity</button>
    </div>
  );
}