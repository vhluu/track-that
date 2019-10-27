import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Firebase, { FirebaseProvider } from './util/Firebase';

ReactDOM.render(
  <FirebaseProvider value={new Firebase()}>
    <App />
  </FirebaseProvider>, 
  document.getElementById('root'),
);
