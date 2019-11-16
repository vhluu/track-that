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
      console.log('updatin tag', action);
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;
