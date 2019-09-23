var firebaseConfig = {
  apiKey: "AIzaSyDLNyV5xvQ5zOAlcb04q11yr-0SrLo4XaM",
  authDomain: "trackthat-9a3ff.firebaseapp.com",
  databaseURL: "https://trackthat-9a3ff.firebaseio.com",
  projectId: "trackthat-9a3ff",
  storageBucket: "",
  messagingSenderId: "925564062879",
  appId: "1:925564062879:web:3699f8c1eebae75d86a6aa"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Creates a user in the database
function createUser(userId, email) {
  firebase.database().ref(`users/${userId}`).once('value').then(function(snapshot) {
    if(!snapshot.val()) {
      console.log('add user to db with user id ' + userId);
      database.ref('users/' + userId).set({
        email: email,
      });
      chrome.storage.sync.set({"tt-created-user": true}, function() {
        console.log("Created new user in firebase");
      });
    }
  });
}

// Adds a tag to the user's tag list in the database
function createTag(userId, tagId, tag) {
  firebase.database().ref(`users/${userId}/tags/${tagId}`).set({
    icon: tag.icon,
    title: tag.title,
    color: tag.color
  });
}

// Gets the user's tag list
function getTags(userId) {

}