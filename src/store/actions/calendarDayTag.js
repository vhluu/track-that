import db from '../../util/firebase';
import * as actionTypes from './actionTypes';

export const setDayTags = (tags) => ({ type: actionTypes.SET_DAY_TAGS, tags });

export const addDayTag = (tag) => ({ type: actionTypes.ADD_DAY_TAG, tag });

export const updateDayTag = (tag) => ({ type: actionTypes.UPDATE_DAY_TAG, tag });

export const deleteDayTag = (tag) => ({ type: actionTypes.DELETE_DAY_TAG, tag });