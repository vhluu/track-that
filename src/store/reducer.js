import * as actionTypes from './actions/actionTypes';

const initialState = {
  uid: null, // the user id
  tags: {},
  nextId: 1, // the next id to use for newly created tags
  dayTags: {},
  savedStart: null, // the start date for the days we have already grabbed from the database
  savedEnd: null, // the end date ...
  stats: {},
};

// Utility function 
const updateObject = (oldObject, updatedProps) => {
  return {
    ...oldObject,
    ...updatedProps,
  };
};

// Handler for adding tags
const addTag = (state, action) => {
  console.log('adding tag', action);
  return updateObject(state, { 
    tags: updateObject(state.tags, { [action.tag.id]: action.tag }), 
    nextId: state.nextId + 1,
  });
};

// Handler for deleting tags
const deleteTag = (state, action) => {
  console.log('deleting tag', action);
  // removing tag from tags
  const { [action.tagId]: deletedItem, ...updatedTags } = state.tags;

  // removing all instances of tag from day tags
  const updatedDT = {};
  Object.keys(state.dayTags).forEach((day) => {
    const filtered = state.dayTags[day].filter((id) => id !== action.tagId);
    if (filtered.length > 0) updatedDT[day] = filtered;
  });

  return updateObject(state, {
    tags: updatedTags,
    dayTags: updatedDT,
  });
};

// Handler for updating tags
const updateTag = (state, action) => {
  console.log('updating tag', action);
  return updateObject(state, {
    tags: updateObject(state.tags, { [action.updatedTag.id]: action.updatedTag }),
  });
};

// Handler for setting tags
const setTags = (state, action) => {
  console.log('setting tags', action);
  if (action.tags) {
    const keys = Object.keys(action.tags);
    console.log(keys);
    console.log(keys[keys.length - 1].substring(1));
    let lastId = keys[keys.length - 1].substring(1);
    if (Number.isNaN(lastId)) lastId = lastId.substring(1);
    return {
      ...state,
      tags: action.tags,
      nextId: parseInt(lastId, 10) + 1,
    };
  }
  return {
    ...state,
  };
};

// Handler for setting user id
const setUser = (state, action) => {
  console.log('getting user', action);
  return updateObject(state, { uid: action.userInfo.userId });
};

// Handler for signing out user
const signOutUser = (state, action) => {
  console.log('signing out user', action);
  return updateObject(state, {
    userId: null,
    tags: {},
    nextId: 1,
    dayTags: {},
    savedStart: null,
    savedEnd: null,
  });
};

// Handler for adding day tags
const addDayTag = (state, action) => {
  const currentDT = state.dayTags[action.date];

  return updateObject(state, {
    dayTags: updateObject(state.dayTags, { 
      [action.date]: currentDT ? currentDT.concat(action.tagId) : [action.tagId],
    }),
  });
};

// Handler for deleting day tags
const deleteDayTag = (state, action) => {
  console.log('deleting day tags', action);
  // removing tags from day tags
  const filteredTags = state.dayTags[action.date].filter((id) => !action.tags.includes(id));
  let updatedDT;
  if (filteredTags.length === 0) { // if all tags are removed from this date, remove the date from dayTags
    const { [action.date]: value, ...withoutDate } = state.dayTags;
    updatedDT = withoutDate;
  } else { // update dayTags with the filtered tagId array for the date
    updatedDT = {
      ...state.dayTags,
      [action.date]: filteredTags,
    };
  }
  return updateObject(state, { dayTags: updatedDT });
};

// Handler for setting day tags
const setDayTags = (state, action) => {
  const updatedState = {
    ...state,
  };

  if (!state.savedStart || action.start < state.savedStart) {
    updatedState.savedStart = action.start;
  }
  if (!state.savedEnd || action.end > state.savedEnd) {
    updatedState.savedEnd = action.end;
  }

  if (action.taggedDays) {
    const tempObject = { ...action.taggedDays };
    // for each day, get the tags associated with it and store it as an array
    Object.keys(action.taggedDays).forEach((day) => {
      tempObject[day] = Object.keys(action.taggedDays[day]);
    });

    updatedState.dayTags = {
      ...state.dayTags,
      ...tempObject,
    };
  } 
  return updatedState;
};

// Handler for replacing day tags
const replaceDayTags = (state, action) => {
  return updateObject(state, {
    dayTags: updateObject(state.dayTags, { [action.date]: action.tags }),
  });
};

// Handler for setting stats
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

// Handler for deleting stats
const clearStats = (state) => updateObject(state, { stats: {} });

// Object of action types to handlers
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
    return handlers[actionTypes[action.type]](state, action);
  }
  return state;
};

/* OLD STUFF STARTS HERE */

/* const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TAG:
      console.log('adding tag', action);
      return {
        ...state,
        tags: {
          ...state.tags,
          [action.tag.id]: action.tag,
        },
        nextId: state.nextId + 1,
      };
    case actionTypes.DELETE_TAG: {
      console.log('deleting tag', action);
      const { [action.tagId]: deletedItem, ...updatedTags } = state.tags;
      
      // removing tag from day tags
      const updatedDT = {};
      Object.keys(state.dayTags).forEach((day) => {
        const filtered = state.dayTags[day].filter((id) => id !== action.tagId);
        if (filtered.length > 0) updatedDT[day] = filtered;
      });
      return {
        ...state,
        tags: updatedTags,
        dayTags: updatedDT,
      };
    }
    case actionTypes.UPDATE_TAG:
      console.log('updating tag', action);
      return {
        ...state,
        tags: {
          ...state.tags,
          [action.updatedTag.id]: action.updatedTag,
        },
      };
    case actionTypes.SET_TAGS: {
      console.log('setting tags', action);
      if (action.tags) {
        const keys = Object.keys(action.tags);
        console.log(keys);
        console.log(keys[keys.length - 1].substring(1));
        let lastId = keys[keys.length - 1].substring(1);
        if (Number.isNaN(lastId)) lastId = lastId.substring(1);
        return {
          ...state,
          tags: action.tags,
          nextId: parseInt(lastId, 10) + 1,
        };
      }
      return {
        ...state,
      };
    }
    case actionTypes.SET_USER:
      console.log('getting user', action);
      return {
        ...state,
        uid: action.userInfo.userId,
      };
    case actionTypes.SIGN_OUT_USER:
      console.log('signing out user', action);
      return {
        ...state,
        userId: null,
        tags: {},
        nextId: 1,
        dayTags: {},
        savedStart: null,
        savedEnd: null,
      };
    case actionTypes.ADD_DAY_TAG: {
      const currentDT = state.dayTags[action.date];
      return {
        ...state,
        dayTags: {
          ...state.dayTags,
          [action.date]: currentDT ? currentDT.concat(action.tagId) : [action.tagId],
        },
      };
    }
    case actionTypes.DELETE_DAY_TAG: {
      console.log('deleting day tags', action);
      // removing tags from day tags
      const filteredTags = state.dayTags[action.date].filter((id) => !action.tags.includes(id));
      let updatedDT;
      if (filteredTags.length === 0) { // if all tags are removed from this date, remove the date from dayTags
        const { [action.date]: value, ...withoutDate } = state.dayTags;
        updatedDT = withoutDate;
      } else { // update dayTags with the filtered tagId array for the date
        updatedDT = {
          ...state.dayTags,
          [action.date]: filteredTags,
        };
      }
      return {
        ...state,
        dayTags: {
          ...updatedDT,
        },
      };
    }
    case actionTypes.SET_DAY_TAGS: {
      const updatedState = {
        ...state,
      };

      if (!state.savedStart || action.start < state.savedStart) {
        updatedState.savedStart = action.start;
      }
      if (!state.savedEnd || action.end > state.savedEnd) {
        updatedState.savedEnd = action.end;
      }

      if (action.taggedDays) {
        const tempObject = { ...action.taggedDays };
        // for each day, get the tags associated with it and store it as an array
        Object.keys(action.taggedDays).forEach((day) => {
          tempObject[day] = Object.keys(action.taggedDays[day]);
        });

        updatedState.dayTags = {
          ...state.dayTags,
          ...tempObject,
        };
      } 
      return updatedState;
    }
    case actionTypes.REPLACE_DAY_TAGS: {
      return {
        ...state, 
        dayTags: {
          ...state.dayTags,
          [action.date]: action.tags,
        },
      };
    }
    case actionTypes.SET_STATS: {
      const moreStats = {
        ...state.stats,
        [action.tagId]: {},
      };
      if (action.days) {
        Object.entries(action.days).forEach(([month, days]) => {
          moreStats[action.tagId][month] = Object.keys(days).length;
        });
      }

      return {
        ...state, 
        stats: {
          ...moreStats,
        },
      };
    }
    case actionTypes.CLEAR_STATS:
      return {
        ...state, 
        stats: {},
      };
    default:
      return state;
  }
}; */

export default reducer;
