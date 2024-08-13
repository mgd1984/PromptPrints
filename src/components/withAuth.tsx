import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Define the HOC that takes a component as input
const withAuth = (Component: React.ComponentType) => {
  return (props: any) => {
    // Use the Auth0 hook to access authentication state
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    // Show a loading state while checking authentication
    if (isLoading) {
      return <div>Loading...</div>;
    }

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
      loginWithRedirect();
      return <div>Redirecting...</div>;
    }

    // If the user is authenticated, render the wrapped component
    return <Component {...props} />;
  };
};

export default withAuth;