import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setDayTags = (tags) => ({ type: actionTypes.SET_DAY_TAGS, tags });

export const addDayTag = (tagId, date) => ({ type: actionTypes.ADD_DAY_TAG, tagId, date });

export const updateDayTag = (tag) => ({ type: actionTypes.UPDATE_DAY_TAG, tag });

export const deleteDayTag = (tag) => ({ type: actionTypes.DELETE_DAY_TAG, tag });

export const createDayTag = (tagId, date) => {
  return (dispatch, getState) => {
    console.log('creating day tag');
    console.log(tagId);
    console.log(date);
    // add tag to the database
    const { uid } = getState();
    db.ref(`users/${uid}/tagged/${date.month}${date.year}/${tagId}/${date.date}`).set(true);
    db.ref(`users/${uid}/tags/${(tagId).substring(1)}/months/${date.month}${date.year}`).set(true); // keeps track of months that include this tag
    dispatch(addDayTag(tagId, date));
  };
};
