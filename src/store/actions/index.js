import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setUser = (userInfo) => ({ type: actionTypes.SET_USER, userInfo });

export const setTags = (tags) => ({ type: actionTypes.SET_TAGS, tags });

export const getUserFailed = () => ({ type: actionTypes.GET_USER_FAILED });

export const initUser = () => {
  return (dispatch) => {
    chrome.extension.sendMessage({ greeting: 'hello from calendar' }, (response) => {
      if (response && response.userId) {
        console.log(response);
        dispatch(setUser(response));
        return db.ref(`users/${response.userId}/tags`).once('value').then((snapshot) => dispatch(setTags(snapshot.val())));
      } 
      
      console.log("Couldn't get user");
      dispatch(getUserFailed());
    });
  };
};

// Creates a user in the database
/* export const createUser = (userId, email) => {
  return (dispatch) => {
    db.ref(`users/${userId}`).once('value').then((snapshot) => {
      if (!snapshot.val()) {
        console.log('added user to db with user id ' + userId);
        this.db.ref(`users/${userId}`).set({ email });
      }
    });
  };
}; */


/* dbGetTags(userId) {
  return this.db.ref(`users/${userId}/tags`).once('value').then((snapshot) => snapshot.val());
}

// Gets tags set for each day in the given month/year (mm/yyyy)
dbGetDayTags(userId, month, year) {
  return this.db.ref(`users/${userId}/tagged/${month}${year}`).once('value').then((snapshot) => snapshot.val());
} */
