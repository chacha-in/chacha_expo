import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  ACCOUNT_DELETED,
  GET_USEREMAIL,
  GET_WEB3_ACCOUNT_SUCCESS
} from '../actions/types';

import { AsyncStorage } from 'react-native';

const initialState = {
  token: AsyncStorage.getItem('userToken'),
  isAuthenticated: null,
  loading: true,
  user: {},
  forgotPassword: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case GET_USEREMAIL:
      // 액션실행 후 전달받은 type의 위 케이스로 조건이 들어오면 아래 명령을 실행한다.
      // 우선 로컬스토리지에 jwt 토큰 값을 저장한다.
      AsyncStorage.setItem('userToken', payload.token);
      // state, payload는 기존 값을 그대로 보존하고 isAuthenticated, loading 항목은 아래와 같이 상태 값을 변경한다.
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      AsyncStorage.clear();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: {}

        // replaceAlert: true
      };

    default:
      return state;
  }
};
