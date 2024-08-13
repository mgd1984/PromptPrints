import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const withAuth = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    // Debugging logs
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isLoading:", isLoading);

    // Prevent the component from rendering if the authentication state is still loading
    if (isLoading) {
      console.log("Loading authentication state...");
      return <div>Loading...</div>;
    }

    useEffect(() => {
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting...");
        loginWithRedirect();
      }
    }, [isAuthenticated, loginWithRedirect]);

    // Only render the component if the user is authenticated
    if (isAuthenticated) {
      console.log("User is authenticated, rendering component...");
      return <Component {...props} />;
    }

    // Avoid rendering anything while redirecting
    console.log("Returning null during redirection...");
    return null;
  };
};

export default withAuth;