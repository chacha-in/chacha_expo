import { AsyncStorage } from 'react-native';

import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  GET_USEREMAIL
} from './types';

// Load User
export const loadUser = () => async dispatch => {
  const userToken = await AsyncStorage.getItem('userToken');
  try {
    const res = await fetch('https://blochaid.io/api/auth', {
      method: 'GET',
      headers: {
        'x-auth-token': userToken
      }
    });

    console.log(res);

    const resJson = await res.json();

    dispatch({
      type: USER_LOADED,
      payload: resJson
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// // Register User
// export const register = ({
//   email,
//   password,
//   username,
//   corpName,
//   corpId
// }) => async dispatch => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   const body = JSON.stringify({ email, password, username, corpName, corpId });

//   console.log(body);
//   try {
//     const res = await axios.post('/api/users', body, config);

//     dispatch({
//       type: REGISTER_SUCCESS,
//       payload: res.data
//     });

//     dispatch(loadUser());
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//     }

//     dispatch({
//       type: REGISTER_FAIL
//     });
//   }
// };

// // Login User 로그인 실행시 액션
// export const login = (email, password) => async dispatch => {
//   //  config에 request header 내용을 담는다.
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   // request body에 들어갈 내용으로 email과 password를 담는다.
//   const body = JSON.stringify({ email, password });

//   try {
//     // 비동기로 api서버에 post방식으로 값을 전달한다.
//     const res = await axios.post('/api/auth', body, config);

//     // 성공하면 리듀서에 response data를 전달한다.
//     dispatch({
//       type: LOGIN_SUCCESS,
//       payload: res.data
//     });

//     dispatch(loadUser());
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//     }
//     dispatch({
//       type: LOGIN_FAIL
//     });
//   }
// };

// // ForgotPassword
// export const forgotPassword = ({ email, call_num }) => async dispatch => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
//   const body = JSON.stringify({ email, call_num });

//   try {
//     const res = await axios.post('/api/auth/forgotpassword', body, config);
//     dispatch(setAlert(res.data, 'success'));
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//     }
//   }
// };

// // updatePassword
// export const updatePassword = ({ password, email }) => async dispatch => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };

//   const body = JSON.stringify({ email, password });

//   try {
//     const res = await axios.put(
//       '/api/auth/updatePasswordViaEmail',
//       body,
//       config
//     );
//     dispatch(setAlert(res.data, 'success'));
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//     }
//   }
// };

// // getResetPasswordToken
// export const getResetPasswordToken = token => async dispatch => {
//   try {
//     const res = await axios.get('/api/auth/reset/', {
//       params: {
//         resetPasswordToken: token
//       }
//     });

//     dispatch({
//       type: GET_USEREMAIL,
//       payload: res.data
//     });

//     dispatch(loadUser());
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//     }
//   }
// };

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  });
};
