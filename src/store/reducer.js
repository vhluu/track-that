import * as actionTypes from './actions/actionTypes';

const initialState = {
  userId: null,
  tags: [],
  nextId: 1,
  dayTags: null,
};

const reducer = (state = initialState, action) => {
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
        const filtered = state.dayTags[day].filter((id) => id !== `t${action.tagId}`);
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
        return {
          ...state,
          tags: action.tags,
          nextId: parseInt(keys[keys.length - 1]) + 1,
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
    case actionTypes.CREATE_USER_SUCCESS:
      console.log('creating user', action);
      return {
        ...state,
      };
    case actionTypes.GET_USER_FAILED:
      console.log('failed to get user', action);
      return {
        ...state,
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
    case actionTypes.DELETE_DAY_TAG:
      return {
        ...state,
      };
    case actionTypes.UPDATE_DAY_TAG:
      return {
        ...state,
      };
    case actionTypes.SET_DAY_TAGS: {
      const tempObject = {};
      Object.keys(action.tags).map((tagId) => {
        Object.keys(action.tags[tagId]).map((day) => {
          if (tempObject[day]) tempObject[day].push(tagId);
          else tempObject[day] = [tagId];
        });
      });
      console.log(tempObject);
      return {
        ...state,
        dayTags: tempObject,
      };
    }
    default:
      return state;
  }
};

export default reducer;
