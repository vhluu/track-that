import * as actionTypes from './actions/actionTypes';

const initialState = {
  userId: null,
  tags: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_TAG:
      console.log('creating tag', action);
      return {
        ...state,
      };
    case actionTypes.DELETE_TAG:
      console.log('deleting tag', action);
      return {
        ...state,
      };
    case actionTypes.UPDATE_TAG:
      console.log('updating tag', action);
      return {
        ...state,
      };
    case actionTypes.SET_TAGS:
      console.log('setting tags', action);
      return {
        ...state,
        tags: action.tags,
      };
    case actionTypes.SET_USER:
      console.log('getting user', action);
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
