export const setUser = (uid) => ({ type: 'SET_USER', uid });

export const getUserFailed = () => ({ type: 'GET_USER_FAILED' });

export const initUser = () => {
  return (dispatch) => {
    chrome.extension.sendMessage({ greeting: 'hello from calendar' }, (response) => {
      if (response && response.userId) {
        dispatch(setUser(response.userId));
      } else {
        console.log("Couldn't get user");
        dispatch(getUserFailed());
      }
    });
  };
};
