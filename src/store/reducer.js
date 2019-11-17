const initialState = {
  userId: null,
  tags: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_TAG':
      console.log('creating tag', action);
      return {
        ...state,
      };
    case 'DELETE_TAG':
      console.log('deleting tag', action);
      return {
        ...state,
      };
    case 'UPDATE_TAG':
      console.log('updating tag', action);
      return {
        ...state,
      };
    case 'SET_TAGS':
      console.log('setting tags', action);
      return {
        ...state,
      };
    case 'SET_USER':
      console.log('getting user', action);
      return {
        ...state,
      };
    case 'GET_USER_FAILED':
      console.log('failed to get user', action);
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;
