import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import netlifyAuth from '../netlifyAuth.js';
import * as fal from "@fal-ai/serverless-client";
import '../styles/globals.css';
import { Auth0Provider } from '@auth0/auth0-react';

fal.config({
  proxyUrl: "/api/fal/proxy",
});

interface User {
  id: string;
  name: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

const App = ({ Component, pageProps }: AppProps) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleLogin = (user: User) => {
      setLoggedIn(true);
      setUser(user);
      console.log('Logged in user:', user);
    };

    const handleLogout = () => {
      setLoggedIn(false);
      setUser(null);
      console.log('User logged out');
    };

    console.log('Attaching event listeners to NetlifyAuth...');
    netlifyAuth.on('login', handleLogin);
    netlifyAuth.on('logout', handleLogout);

    return () => {
      netlifyAuth.off('login', handleLogin);
      netlifyAuth.off('logout', handleLogout);
    };
  }, []);

  const login = () => {
    netlifyAuth.authenticate((user: User) => {
      setLoggedIn(!!user);
      setUser(user);
      console.log('Logged in user:', user);
    });
  };

  const logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false);
      setUser(null);
      console.log('User logged out');
    });
  };

  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';


  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
      authorizationParams={{ redirect_uri: redirectUri }}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );

}
export default App;