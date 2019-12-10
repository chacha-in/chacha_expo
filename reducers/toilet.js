import {
  GET_TOILETDETAIL_BY_ID,
  DELETE_TOILETDETAIL_REDUCER,
  TOILET_ERROR,
  UPDATE_TOILETDETAIL_COMMENT
} from '../actions/types';

const initialState = {
  toilets: [],
  toiletDetail: null,
  loading: true,
  error: {}
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_TOILETDETAIL_BY_ID:
      return {
        ...state,
        toiletDetail: payload,
        loading: false
      };
    case DELETE_TOILETDETAIL_REDUCER:
      return {
        ...state,
        toiletDetail: null
      };
    case UPDATE_TOILETDETAIL_COMMENT:
      return {
        ...state,

        toiletDetail: { ...state.toiletDetail, comments: payload }
      };
    case TOILET_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};
