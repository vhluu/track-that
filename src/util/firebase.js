import app from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyDLNyV5xvQ5zOAlcb04q11yr-0SrLo4XaM',
  authDomain: 'trackthat-9a3ff.firebaseapp.com',
  databaseURL: 'https://trackthat-9a3ff.firebaseio.com',
  projectId: 'trackthat-9a3ff',
  storageBucket: '',
  messagingSenderId: '925564062879',
  appId: '1:925564062879:web:3699f8c1eebae75d86a6aa',
};

app.initializeApp(config);
const db = app.database();

export default db;
