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
function dbCreateUser(userId, email) {
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
function dbCreateTag(userId, tag) {
  firebase.database().ref(`users/${userId}/tags/${tag.id}`).set({
    icon: tag.icon,
    title: tag.title,
    color: tag.color
  });
}

// Updates the tag in the database
function dbUpdateTag(userId, tag) {
  var tagId = (tag.id).substring(1);
  console.log(tagId);
  firebase.database().ref(`users/${userId}/tags/${tagId}`).update({
    icon: tag.icon,
    title: tag.title,
    color: tag.color
  });
}

// Removes the tag in the database
function dbDeleteTag(userId, tagId) {
  firebase.database().ref(`users/${userId}/tags/${tagId}`).remove();
  
  // remove tag from tagged days
  var updates = {};
  // need to know month year 092019 and specific day
  /*updates[`users/${userId}/tagged/`];
  firebase.database().ref().update(updates);*/
}

// Gets the user's tag list
function dbGetTags(userId) {
  return firebase.database().ref(`users/${userId}/tags`).once('value').then(function(snapshot) {
    return snapshot.val();
  });
}

// Adds a tag to a specific day (mm dd yyyy)
function dbCreateDayTag(userId, dayTag, month, year) {
  //firebase.database().ref(`users/${userId}/tagged/${month}${year}/${dayTag.date}/${dayTag.id}`).set(true);
  //firebase.database().ref(`users/${userId}/tagged/${dayTag.id}/${month}${year}/${dayTag.date}`).set(true);
  firebase.database().ref(`users/${userId}/tagged/${month}${year}/${dayTag.id}/${dayTag.date}`).set(true);
  firebase.database().ref(`users/${userId}/tags/${(dayTag.id).substring(1)}/months/${month}${year}`).set(true);
}

// Gets tags set for each day in the given month/year (mm/yyyy)
function dbGetDayTags(userId, month, year) {
  /*return firebase.database().ref(`users/${userId}/tagged/${month}${year}`).once('value').then(function(snapshot) {
    return snapshot.val();
  });*/
  
  /*return dbGetTags(userId).then(function(tags) {
    var promisesList = [];
    (Object.keys(tags)).forEach(function(tagId) {
      promisesList.push(firebase.database().ref(`users/${userId}/tagged/t${tagId}/${month}${year}`).once('value').then(function(snapshot) {
        var obj = {
          id: tagId,
          days: snapshot.val()
        };
        return obj;
      }))
    });
    return Promise.all(promisesList).then(function(values){
      console.log(values);
      return values;
    });
  });*/

  return firebase.database().ref(`users/${userId}/tagged/${month}${year}`).once('value').then(function(snapshot) {
    return snapshot.val();
  });
}