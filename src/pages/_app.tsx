// File: pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import netlifyAuth from '../netlifyAuth.js';

// Check if the netlifyAuth module provides the 'on' function
console.log(netlifyAuth);

// Add your code here to handle the authentication logic
import '../styles/globals.css';

interface User {
    id: string;
    name: string;
    email: string;
    user_metadata: {
      full_name: string;
    };
  }
  
  const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
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
  
      (netlifyAuth as any).on('login', handleLogin);
      (netlifyAuth as any).on('logout', handleLogout);
  
      return () => {
        (netlifyAuth as any).off('login', handleLogin);
        (netlifyAuth as any).off('logout', handleLogout);
      };
    }, []);
  
    const login = () => {
      netlifyAuth.authenticate((user: User) => {
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
      <SessionProvider session={session}>
        {loggedIn ? (
          <div>
            <p>You are logged in!</p>
            {user && <p>Welcome, {user.user_metadata.full_name}!</p>}
            <button onClick={logout}>Log out here</button>
          </div>
        ) : (
          <button onClick={login}>Log in here</button>
        )}
        <Component {...pageProps} />
      </SessionProvider>
    );
  };
  
  export default App;