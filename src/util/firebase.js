import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const config = {
  apiKey: '<FIREBASE-API-KEY>',
  authDomain: '<FIREBASE-AUTH-DOMAIN>',
  databaseURL: '<FIREBASE-DATABASE-URL>',
  projectId: '<FIREBASE-PROJECT-ID>',
  storageBucket: '',
  appId: '<FIREBASE-API-ID>',
};

app.initializeApp(config);

export const db = app.database();

export const fbApp = app;
