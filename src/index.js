import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import Firebase, { FirebaseProvider } from './util/Firebase';

ReactDOM.render(
  <FirebaseProvider value={new Firebase()}>
    <App />
  </FirebaseProvider>, 
  document.getElementById('root'),
);
