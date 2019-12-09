import axios from 'axios';
import { setAlert } from './alert';

// registerCorporation
export const registerCorporation = ({
  password,
  email,
  corperation
}) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password, corperation });

  try {
    const res = await axios.put(
      '/api/auth/updatePasswordViaEmail',
      body,
      config
    );
    dispatch(setAlert(res.data, 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

export const getWeb3Account = account => async dispatch => {
  if (account) {
    dispatch({
      type: GET_WEB3_ACCOUNT_SUCCESS,
      payload: account
    });
  }
};
