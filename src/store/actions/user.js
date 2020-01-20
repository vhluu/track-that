import db from '../../util/firebase';
import * as actionTypes from './actionTypes';
import { setTags } from './tag';

export const setUser = (userInfo) => ({ type: actionTypes.SET_USER, userInfo });

export const getUserFailed = () => ({ type: actionTypes.GET_USER_FAILED });

export const createUserSuccess = () => ({ type: actionTypes.CREATE_USER_SUCCESS });

export const signOutUser = () => ({ type: actionTypes.SIGN_OUT_USER });

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

export const initUser = (greeting, login) => {
  return (dispatch) => {
    // gets logged-in user information from background script
    chrome.extension.sendMessage({ greeting, login }, (response) => {
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