import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setStats = (tagId, days) => ({ type: actionTypes.SET_STATS, tagId, days });

export const getStats = (tagId, start, end) => {
  // console.log(`getting months ${start} to ${end} from database!`);

  return (dispatch, getState) => {
    const { uid } = getState();
    // get the tags for the dates within the specified range (start to end inclusive)
    return db.ref(`users/${uid}/stats/${tagId}`).once('value').then((snapshot) => dispatch(setStats(tagId, snapshot.val())));
  };
}; 
