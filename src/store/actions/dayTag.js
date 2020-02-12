import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setDayTags = (start, end, taggedDays) => ({ type: actionTypes.SET_DAY_TAGS, start, end, taggedDays });

export const addDayTag = (tagId, date) => ({ type: actionTypes.ADD_DAY_TAG, tagId, date });

export const updateDayTag = (tag) => ({ type: actionTypes.UPDATE_DAY_TAG, tag });

export const replaceDayTags = (tags, date) => ({ type: actionTypes.REPLACE_DAY_TAGS, tags, date });

export const createDayTag = (tagId, date) => {
  return (dispatch, getState) => {
    const { uid } = getState();

    // add tag to the database
    db.ref(`users/${uid}/tagged/${date}/${tagId}`).set(true);
    db.ref(`users/${uid}/stats/${tagId}/${date}`).set(true); 
    dispatch(addDayTag(tagId, date));
  };
};

export const getDayTags = (start, end) => {
  console.log(`getting months ${start} to ${end} from database!`);

  return (dispatch, getState) => {
    const { uid } = getState();
    // get the tags for the dates within the specified range (start to end inclusive)
    return db.ref(`users/${uid}/tagged`).orderByKey().startAt(start).endAt(end).once('value')
      .then((snapshot) => dispatch(setDayTags(start, end, snapshot.val())));
  };
}; 

export const deleteDayTag = (tags, date) => {
  return (dispatch, getState) => {
    const { uid } = getState();

    const updates = {};
    tags.forEach((tagId) => { 
      updates[`users/${uid}/tagged/${date}/${tagId}`] = null; 
      updates[`users/${uid}/stats/${tagId}/${date}`] = null; 
    });
    db.ref().update(updates); // bulk remove through updates w/ value null

    dispatch({ type: actionTypes.DELETE_DAY_TAG, date, tags });
  };
};
