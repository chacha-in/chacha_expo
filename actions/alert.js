import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  // 5초 뒤에 alert msg가 삭제되도록 설정
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
