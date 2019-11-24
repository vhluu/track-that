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

export const createTag = (newTag) => {
  return (dispatch, getState) => {
    // add tag to the database
    const { uid, nextId } = getState();
    db.ref(`users/${uid}/tags/${nextId}`).set({
      icon: newTag.icon,
      title: newTag.title,
      color: newTag.color,
    });
    const tag = { ...newTag, id: nextId }; 
    dispatch(addTag(tag));
  };
};

export const updateTag = (updatedTag) => {
  return (dispatch, getState) => {
    db.ref(`users/${getState().uid}/tags/${updatedTag.id}`).update({
      icon: updatedTag.icon,
      title: updatedTag.title,
      color: updatedTag.color,
    });
    dispatch({ type: actionTypes.UPDATE_TAG, updatedTag });
  };
};

export const deleteTag = (tagId) => {
  return (dispatch, getState) => {
    const { uid } = getState();
    db.ref(`users/${uid}/tags/${tagId.substring(1)}/months`).once('value').then((snapshot) => {
      const months = snapshot.val();
      const updates = {};
      if (months) {
        (Object.keys(months)).forEach((monthYear) => {
          updates[`users/${uid}/tagged/${monthYear}/${tagId}`] = null; // removes tag from each month
        });
      }
      updates[`users/${uid}/tags/${tagId}`] = null; // removes tag from tag list
      db.ref().update(updates); // bulk remove through updates w/ value null
      dispatch({ type: actionTypes.DELETE_TAG, tagId });
    });
  };
}
