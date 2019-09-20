var firebaseConfig = {
  apiKey: "<API-KEY>",
  authDomain: "<AUTH-DOMAIN>",
  databaseURL: "<DB-URL>",
  projectId: "<PROJECT-ID>",
  storageBucket: "",
  messagingSenderId: "<MSG-SENDER-ID>",
  appId: "<APP-ID>"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

function writeUserData(userId, email) {
  firebase.database().ref('users/' + userId).set({
    email: email,
  });
}