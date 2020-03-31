import * as actionTypes from './actions/actionTypes';
import { updateObject, removeProp } from '../util/utility';

const initialState = {
  uid: null, // the user id
  tags: {},
  nextId: 1, // the next id to use for newly created tags
  dayTags: {},
  savedStart: null, // the start date for the days we have already grabbed from the database
  savedEnd: null, // the end date ...
  stats: {},
};


/* ==== Reducer Case Handlers ==== */

/* Adds tags */
const addTag = (state, action) => {
  return updateObject(state, { 
    tags: updateObject(state.tags, { [action.tag.id]: action.tag }), 
    nextId: state.nextId + 1,
  });
};

/* Deletes tags */
const deleteTag = (state, action) => {
  // removing all instances of tag from day tags
  const updatedDT = {};
  Object.keys(state.dayTags).forEach((day) => {
    const filtered = state.dayTags[day].filter((id) => id !== action.tagId);
    if (filtered.length > 0) updatedDT[day] = filtered;
  });

  return updateObject(state, {
    tags: removeProp(state.tags, action.tagId),
    dayTags: updatedDT,
  });
};

/* Updates tags */
const updateTag = (state, action) => {
  return updateObject(state, {
    tags: updateObject(state.tags, { [action.updatedTag.id]: action.updatedTag }),
  });
};

/* Sets tags */
const setTags = (state, action) => {
  if (action.tags) {
    // get the last tag id number and set nextId to (number + 1)
    const keys = Object.keys(action.tags);
    let lastId = keys[keys.length - 1].substring(1);
    if (Number.isNaN(lastId)) lastId = lastId.substring(1);

    return updateObject(state, {
      tags: action.tags,
      nextId: parseInt(lastId, 10) + 1,
    });
  }
  return {
    ...state,
  };
};

/* Sets user id */
const setUser = (state, action) => {
  return updateObject(state, { uid: action.userInfo.userId });
};

/* Signs out user */
const signOutUser = (state) => {
  return updateObject(state, {
    userId: null,
    tags: {},
    nextId: 1,
    dayTags: {},
    savedStart: null,
    savedEnd: null,
  });
};

/* Adds day tag */
const addDayTag = (state, action) => {
  const currentDT = state.dayTags[action.date];

  return updateObject(state, {
    dayTags: updateObject(state.dayTags, { 
      [action.date]: currentDT ? currentDT.concat(action.tagId) : [action.tagId],
    }),
  });
};

/* Deletes day tag */
const deleteDayTag = (state, action) => {
  // removing specified tags from day tags
  const filteredTags = state.dayTags[action.date].filter((id) => !action.tags.includes(id));
  
  let updatedDT;
  if (filteredTags.length === 0) { // if this date has no tags, then remove the date from dayTags
    updatedDT = removeProp(state.dayTags, action.date);
  } else { // update dayTags with the filtered tagId array for the date
    updatedDT = updateObject(state.dayTags, { [action.date]: filteredTags });
  }

  return updateObject(state, { dayTags: updatedDT });
};

/* Sets day tag */
const setDayTags = (state, action) => {
  const updates = {};

  // update start & end date w/ days we've just fetched from the database
  if (!state.savedStart || action.start < state.savedStart) {
    updates.savedStart = action.start;
  }
  if (!state.savedEnd || action.end > state.savedEnd) {
    updates.savedEnd = action.end;
  }

  if (action.taggedDays) {
    const tempObject = { ...action.taggedDays };
    // for each day, get the tags associated with it and store it as an array
    Object.keys(action.taggedDays).forEach((day) => {
      tempObject[day] = Object.keys(action.taggedDays[day]);
    });

    updates.dayTags = updateObject(state.dayTags, tempObject);
  } 

  return updateObject(state, updates);
};

/* Replaces day tags */
const replaceDayTags = (state, action) => {
  return updateObject(state, {
    dayTags: updateObject(state.dayTags, { [action.date]: action.tags }),
  });
};

/* Sets tag stats */
const setStats = (state, action) => {
  const moreStats = updateObject(state.stats, { [action.tagId]: {} });
  if (action.days) {
    // add monthly stats for current tag
    Object.entries(action.days).forEach(([month, days]) => {
      moreStats[action.tagId][month] = Object.keys(days).length;
    });
  }

  return updateObject(state, { stats: moreStats });
};

/* Deletes tag stats */
const clearStats = (state) => updateObject(state, { stats: {} });

/* ==== End of Reducer Case Handlers ==== */


// Action Types -> Handlers
const handlers = {
  ADD_TAG: addTag,
  DELETE_TAG: deleteTag,
  UPDATE_TAG: updateTag,
  SET_TAGS: setTags,
  SET_USER: setUser,
  SIGN_OUT_USER: signOutUser,
  ADD_DAY_TAG: addDayTag,
  DELETE_DAY_TAG: deleteDayTag,
  SET_DAY_TAGS: setDayTags,
  REPLACE_DAY_TAGS: replaceDayTags,
  SET_STATS: setStats,
  CLEAR_STATS: clearStats,
};

// Reducer 
const reducer = (state = initialState, action) => {
  if (handlers[action.type]) {
    console.log(action.type, action);
    return handlers[actionTypes[action.type]](state, action);
  }
  return state;
};

export default reducer;
