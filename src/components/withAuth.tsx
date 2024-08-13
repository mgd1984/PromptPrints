import React, { useEffect, ComponentType } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const withAuth = (Component: ComponentType<any>) => {
  return (props: any) => {
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    // Prevent the component from rendering if the authentication state is still loading
    if (isLoading) {
      return <div>Loading...</div>;
    }

    // Redirect only when the user is not authenticated and prevent further rendering
    useEffect(() => {
      if (!isAuthenticated) {
        loginWithRedirect();
      }
    }, [isAuthenticated, loginWithRedirect]);

    // Only render the component if the user is authenticated
    if (isAuthenticated) {
      return <Component {...props} />;
    }

    // Return null while redirecting to avoid any rendering
    return null;
  };
};

export default withAuth;