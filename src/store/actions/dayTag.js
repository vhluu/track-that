import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setDayTags = (date, tags) => ({ type: actionTypes.SET_DAY_TAGS, date, tags });

export const addDayTag = (tagId, date) => ({ type: actionTypes.ADD_DAY_TAG, tagId, date });

export const updateDayTag = (tag) => ({ type: actionTypes.UPDATE_DAY_TAG, tag });

/* Formats the given number as two digits */
export const formatDigit = (num) => (num < 10 ? `0${num}` : num);

export const createDayTag = (tagId, date) => {
  return (dispatch, getState) => {
    // add tag to the database
    const { uid } = getState();
    const formattedMonth = formatDigit((date.month + 1) % 13);
    db.ref(`users/${uid}/tagged/${formattedMonth}${date.year}/${tagId}/${date.date}`).set(true);
    db.ref(`users/${uid}/tags/${(tagId).substring(1)}/months/${formattedMonth}${date.year}`).set(true); // keeps track of months that include this tag
    dispatch(addDayTag(tagId, date.date));
  };
};

export const getDayTags = (month, year) => {
  return (dispatch, getState) => {
    const { uid } = getState();
    const fullDate = `${formatDigit((month + 1) % 13)}${year}`;
    return db.ref(`users/${uid}/tagged/${fullDate}`).once('value').then((snapshot) => dispatch(setDayTags(fullDate, snapshot.val())));
  };
}; 

export const deleteDayTag = (tags, { topMonth, month, day, year }) => {
  return (dispatch, getState) => {
    const { uid } = getState();

    const updates = {};
    const formatTopMonth = formatDigit((topMonth + 1) % 13);
    tags.forEach((tag) => { updates[`users/${uid}/tagged/${formatTopMonth}${year}/${tag}/${month}${day}`] = null; });
    db.ref().update(updates); // bulk remove through updates w/ value null

    const date = { month, day, year };
    dispatch({ type: actionTypes.DELETE_DAY_TAG, date, tags });

    // TODO: handle case where we removed all instances of that tag from that month
  };
};
