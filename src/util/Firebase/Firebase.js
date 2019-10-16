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

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.db = app.database();
  }

  // Creates a user in the database
  dbCreateUser(userId, email) {
    this.db.ref(`users/${userId}`).once('value').then((snapshot) => {
      if (!snapshot.val()) {
        // console.log('added user to db with user id ' + userId);
        this.db.ref(`users/${userId}`).set({ email });
        /* chrome.storage.sync.set({"tt-created-user": true}, function() {
          console.log("Created new user in firebase");
        }); */
      }
    });
  }

  // Gets the user's tag list
  dbGetTags(userId) {
    return this.db.ref(`users/${userId}/tags`).once('value').then((snapshot) => snapshot.val());
  }

  /* // Adds a tag to the user's tag list in the database
  dbCreateTag(userId, tag) {
    firebase.database().ref(`users/${userId}/tags/${tag.id}`).set({
      icon: tag.icon,
      title: tag.title,
      color: tag.color
    });
  }

  // Updates the tag in the database
  dbUpdateTag(userId, tag) {
    const tagId = (tag.id).substring(1);
    firebase.database().ref(`users/${userId}/tags/${tagId}`).update({
      icon: tag.icon,
      title: tag.title,
      color: tag.color
    });
  }

  // Removes the tag in the database
  dbDeleteTag(userId, tagId) {
    // get months that include the tag
    firebase.database().ref(`users/${userId}/tags/${tagId.substring(1)}/months`).once('value').then(function(snapshot) {
      const months = snapshot.val();
      let updates = {};
      (Object.keys(months)).forEach(function(monthYear) {
        updates[`users/${userId}/tagged/${monthYear}/${tagId}`] = null; // removes tag from each month
      });

      updates[`users/${userId}/tags/${tagId.substring(1)}`] = null; // removes tag from tag list
      firebase.database().ref().update(updates); // bulk remove through updates w/ value null
    });
  } */

  /* // Gets the user's tag list
  dbGetTags(userId) {
    return firebase.database().ref(`users/${userId}/tags`).once('value').then(function(snapshot) {
      return snapshot.val();
    });
  }

  // Adds a tag to a specific day (mm dd yyyy)
  dbCreateDayTag(userId, dayTag, month, year) {
    firebase.database().ref(`users/${userId}/tagged/${month}${year}/${dayTag.id}/${dayTag.date}`).set(true);
    firebase.database().ref(`users/${userId}/tags/${(dayTag.id).substring(1)}/months/${month}${year}`).set(true); // keeps track of months that include this tag
  }

  // Gets tags set for each day in the given month/year (mm/yyyy)
  dbGetDayTags(userId, month, year) {
    return firebase.database().ref(`users/${userId}/tagged/${month}${year}`).once('value').then(function(snapshot) {
      return snapshot.val();
    });
  } */
}

export default Firebase;
