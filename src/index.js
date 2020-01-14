import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './containers/App';
import Logo from './components/Logo/Logo';

import reducer from './store/reducer';


const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Logo />
    <App />
  </Provider>, 
  document.getElementById('root'),
);
