import { AsyncStorage } from 'react-native';

import { setAlert } from './alert';
import {
  GET_TOILETDETAIL_BY_ID,
  UPDATE_TOILETDETAIL_COMMENT,
  DELETE_TOILETDETAIL_COMMENT,
  DELETE_TOILETDETAIL_REDUCER,
  TOILET_ERROR
} from './types';

// Get toilet by id
export const getToiletById = _id => async dispatch => {
  dispatch({ type: DELETE_TOILETDETAIL_REDUCER });
  const userToken = await AsyncStorage.getItem('userToken');

  try {
    const res = await fetch(`https://blochaid.io/api/toilets/${_id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-auth-token': userToken
      }
    });

    const resJson = await res.json();

    dispatch({
      type: GET_TOILETDETAIL_BY_ID,
      payload: resJson
    });
  } catch (err) {
    dispatch({
      type: TOILET_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update toilet by id
export const updateToiletComment = comments => async dispatch => {
  dispatch({ type: UPDATE_TOILETDETAIL_COMMENT, payload: comments });
};

// Delete toilet by id
export const deleteToiletComment = toiletDetail => async dispatch => {
  dispatch({ type: DELETE_TOILETDETAIL_COMMENT, payload: toiletDetail });
};
