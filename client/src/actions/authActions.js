import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, CLEAR_CURRENT_PROFILE } from "./types";

//  Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //  Save to loalStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token); // Set token to localStorage

      setAuthToken(token); // Set token to Auth header
      const decoded = jwt_decode(token); //Decode token to get user data
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set logged in User
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Clear Current Profile
export const clearCurrentProfile = decoded => {
  return {
    type: CLEAR_CURRENT_PROFILE,
    payload: decoded
  };
};

// Log User Out
export const logoutUser = () => dispatch => {

  // Remove token from localstorage
  localStorage.removeItem('jwtToken');

  setAuthToken(false); // Remove auth header for future request

  // Set current user to empty object {} which set isAuthenticates to false
  dispatch(setCurrentUser({}));
}
