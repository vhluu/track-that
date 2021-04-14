import { db } from '../../util/firebase';
import * as actionTypes from './actionTypes';
import { setTags } from './tag';

export const setUser = (userInfo) => ({ type: actionTypes.SET_USER, userInfo });

export const getUserFailed = () => ({ type: actionTypes.GET_USER_FAILED });

export const createUserSuccess = () => ({ type: actionTypes.CREATE_USER_SUCCESS });

export const signOutUser = () => ({ type: actionTypes.SIGN_OUT_USER });

const createUser = (dispatch, userInfo) => {
  // checks if user is in the database, if not, then add them
  db.ref(`users/${userInfo.userId}/created`).once('value').then((snapshot) => {
    if (!snapshot.val()) {
      db.ref(`users/${userInfo.userId}`).set({ created: true });
      dispatch(createUserSuccess());
    }
  });
};

export const initUser = (greeting, login) => {
  return (dispatch) => {
    // gets logged-in user information from background script
    chrome.extension.sendMessage({ greeting, login }, (response) => {
      if (response && response.userId) {
        if (greeting === 'sign in from app') { window.location.reload(); }
        dispatch(setUser(response));

        createUser(dispatch, response); // creates user if not already in database
        return db.ref(`users/${response.userId}/tags`).orderByChild('order').once('value').then((snapshot) => {
          let orderedTags = [];
          let lastId = -1;

          snapshot.forEach((child) => {
            orderedTags.push({
              ...child.val(),
              id: child.key,
            });

            let id = child.key.substring(1);
            if (id > lastId) lastId = id;
          });
          dispatch(setTags(orderedTags, snapshot.val(), lastId));
        });
      }
      
      console.log("Couldn't get user");
      dispatch(getUserFailed());
    });
  };
};
