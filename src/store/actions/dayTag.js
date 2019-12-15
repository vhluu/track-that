import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setDayTags = (date, tags) => ({ type: actionTypes.SET_DAY_TAGS, date, tags });

export const addDayTag = (tagId, date) => ({ type: actionTypes.ADD_DAY_TAG, tagId, date });

export const updateDayTag = (tag) => ({ type: actionTypes.UPDATE_DAY_TAG, tag });

export const createDayTag = (tagId, date) => {
  return (dispatch, getState) => {
    // add tag to the database
    const { uid } = getState();
    db.ref(`users/${uid}/tagged/${(date.month + 1) % 13}${date.year}/${tagId}/${date.date}`).set(true);
    db.ref(`users/${uid}/tags/${(tagId).substring(1)}/months/${(date.month + 1) % 13}${date.year}`).set(true); // keeps track of months that include this tag
    dispatch(addDayTag(tagId, date.date));
  };
};

export const getDayTags = (month, year) => {
  return (dispatch, getState) => {
    const { uid } = getState();
    const fullDate = `${(month + 1) % 13}${year}`;
    return db.ref(`users/${uid}/tagged/${fullDate}`).once('value').then((snapshot) => dispatch(setDayTags(fullDate, snapshot.val())));
  };
}; 

export const deleteDayTag = (tags, { month, day, year }) => {
  return (dispatch, getState) => {
    const { uid } = getState();

    const updates = {};
    tags.forEach((tag) => { updates[`users/${uid}/tagged/${(month + 1) % 13}${year}/${tag}/${(month + 1) % 13}${day}`] = null; });
    db.ref().update(updates); // bulk remove through updates w/ value null
    dispatch({ type: actionTypes.DELETE_DAY_TAG, month, day, year, tags });

    // TODO: handle case where we removed all instances of that tag from that month
  };
};
