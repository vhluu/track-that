import React from 'react';

const FirebaseContext = React.createContext(null);

export const FirebaseProvider = FirebaseContext.FirebaseProvider;
export const FirebaseConsumer = FirebaseContext.Consumer;

export const firebaseHOC = (Component) => (props) => (
  <FirebaseConsumer>
    {(firebase) => <Component {...props} firebase={firebase} />}
  </FirebaseConsumer>
);
