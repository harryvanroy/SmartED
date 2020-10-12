import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';


ReactDOM.render(
  <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login} />
        <ProtectedRoute path='/' component={App} />
      </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);


