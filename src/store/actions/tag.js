import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setTags = (tags) => ({ type: actionTypes.SET_TAGS, tags });

export const addTag = (tag) => ({ type: actionTypes.ADD_TAG, tag });

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
};
