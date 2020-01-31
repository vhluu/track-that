import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setTags = (tags) => ({ type: actionTypes.SET_TAGS, tags });

export const addTag = (tag) => ({ type: actionTypes.ADD_TAG, tag });

export const createTag = (newTag) => {
  return (dispatch, getState) => {
    // add tag to the database
    const { uid, nextId } = getState();
    db.ref(`users/${uid}/tags/t${nextId}`).set({
      icon: newTag.icon,
      title: newTag.title,
      color: newTag.color,
    });
    const tag = { ...newTag, id: `t${nextId}` }; 
    dispatch(addTag(tag));
  };
};

export const updateTag = (updatedTag) => {
  return (dispatch, getState) => {
    // update the tag in the database
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
    db.ref(`users/${uid}/tags/${tagId}/days`).once('value').then((snapshot) => {
      const days = snapshot.val();
      const updates = {};
      if (days) {
        (Object.keys(days)).forEach((day) => {
          updates[`users/${uid}/tagged/${day}/${tagId}`] = null; // removes tag from each month
        });
      }
      updates[`users/${uid}/tags/${tagId}`] = null; // removes tag from tag list
      db.ref().update(updates); // bulk remove through updates w/ value null
      dispatch({ type: actionTypes.DELETE_TAG, tagId });
    });
  };
};
