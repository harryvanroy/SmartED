import React from 'react';
import { Redirect } from 'react-router-dom';

const ProtectedRoute = (props) => {
  const Component = props.component;
  const isAuthenticated = localStorage.getItem('key');
  return isAuthenticated ? (
    <Component />
  ) : (
    <Redirect to={{ pathname: '/login'}} />
  );
}

export default ProtectedRoute;