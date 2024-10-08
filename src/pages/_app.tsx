import { AppProps } from 'next/app';
import { Auth0Provider } from '@auth0/auth0-react';
import { SessionProvider } from 'next-auth/react';
import * as fal from "@fal-ai/serverless-client";
import '../app/globals.css';

fal.config({
  proxyUrl: "/api/fal/proxy",
});

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : '';
  
  return (
    <SessionProvider session={session}>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
        authorizationParams={{ redirect_uri: redirectUri }}
      >
        <Component {...pageProps} />
      </Auth0Provider>
    </SessionProvider>
  );
}

export default App;