import { db } from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setTags = (orderedTags, tags) => ({ type: actionTypes.SET_TAGS, orderedTags, tags });

export const addTag = (tag) => ({ type: actionTypes.ADD_TAG, tag });

export const createTag = (newTag) => {
  return (dispatch, getState) => {
    // add tag to the database
    const { uid } = getState();
    const tagRef = db.ref(`users/${uid}/tags`).push({
      icon: newTag.icon,
      title: newTag.title,
      color: newTag.color,
      order: newTag.order
    });
    const tag = { ...newTag, id: `${tagRef.key}` };
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
    db.ref(`users/${uid}/stats/${tagId}`).once('value').then((snapshot) => {
      const months = snapshot.val();
      const updates = {};

      if (months) {
        (Object.values(months)).forEach((days) => {
          (Object.keys(days)).forEach((day) => {
            updates[`users/${uid}/tagged/${day}/${tagId}`] = null; // removes tag from each month
          });
        });

        updates[`users/${uid}/stats/${tagId}`] = null; // removes stats for the tag
      }
      
      updates[`users/${uid}/tags/${tagId}`] = null; // removes tag from tag list

      db.ref().update(updates); // bulk remove through updates w/ value null

      dispatch({ type: actionTypes.DELETE_TAG, tagId });
    });
  };
};


export const updateOrder = (tag1, tag2) => {
  return (dispatch, getState) => {
    // update the tag order in the database
    db.ref(`users/${getState().uid}/tags/${tag1.id}`).update({ order: tag1.order });
    db.ref(`users/${getState().uid}/tags/${tag2.id}`).update({ order: tag2.order });
    dispatch({ type: actionTypes.UPDATE_TAG_ORDER, tag1, tag2 });
  };
};
