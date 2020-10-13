import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('key');

  return (
    <Route {...rest} render={(props) => isAuthenticated ? (
      <Component {...props} {...rest} /> ) :
      (<Redirect to={{ pathname: '/login'}} />)} />)
};
export default ProtectedRoute;