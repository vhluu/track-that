import * as actionTypes from './actions/actionTypes';

const initialState = {
  userId: null,
  tags: [],
  nextId: 1,
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
      return {
        ...state,
        tags: updatedTags,
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
    default:
      return state;
  }
};

export default reducer;
