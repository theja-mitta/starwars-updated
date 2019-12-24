import React from 'react';
import { render } from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './style.css';
import App from './components';
import Planets from './components/Planets';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { default as ReduxThunk } from 'redux-thunk';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(ReduxThunk));

const customHistory = createBrowserHistory();


render(  
  <Provider store={store}>
    <Router history={customHistory}>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/Planets" component={Planets} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);