import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setUser = (userInfo) => ({ type: actionTypes.SET_USER, userInfo });

export const setTags = (tags) => ({ type: actionTypes.SET_TAGS, tags });

export const addTag = (tag) => ({ type: actionTypes.ADD_TAG, tag });

export const getUserFailed = () => ({ type: actionTypes.GET_USER_FAILED });

export const createUserSuccess = () => ({ type: actionTypes.CREATE_USER_SUCCESS });

const createUser = (dispatch, userInfo) => {
  console.log(userInfo);
  // checks if user is in the database, if not, then add them
  db.ref(`users/${userInfo.userId}`).once('value').then((snapshot) => {
    if (!snapshot.val()) {
      console.log(`adding user to db with user id ${userInfo.userId}`);
      db.ref(`users/${userInfo.userId}`).set({ email: userInfo.email });
      dispatch(createUserSuccess());
    }
  });
};

export const initUser = () => {
  return (dispatch) => {
    // gets logged-in user information from background script
    chrome.extension.sendMessage({ greeting: 'hello from calendar' }, (response) => {
      if (response && response.userId) {
        console.log(response);
        dispatch(setUser(response));

        // checks local storage to see if we already created the user in the database
        chrome.storage.local.get(['tt-created-user'], (result) => {
          console.log(result);
          if (!result['tt-created-user'] || result['tt-created-user'] !== response.userId) {
            chrome.storage.local.set({ 'tt-created-user': response.userId }, function() { console.log('set user in chrome storage'); });
            createUser(dispatch, response); // creates user if not already in database
          }
        });
        return db.ref(`users/${response.userId}/tags`).once('value').then((snapshot) => dispatch(setTags(snapshot.val())));
      } 
      
      console.log("Couldn't get user");
      dispatch(getUserFailed());
    });
  };
};

export const createTag = (tag) => {
  return (dispatch, getState) => {
    // add tag to the database
    db.ref(`users/${getState().uid}/tags/${tag.id}`).set({
      icon: tag.icon,
      title: tag.title,
      color: tag.color,
    });
    dispatch(addTag(tag));
  };
};


/* 
// Gets tags set for each day in the given month/year (mm/yyyy)
dbGetDayTags(userId, month, year) {
  return this.db.ref(`users/${userId}/tagged/${month}${year}`).once('value').then((snapshot) => snapshot.val());
} */
