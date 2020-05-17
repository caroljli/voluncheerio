import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS } from "./types";

// Register User
export const deleteShift = (shiftName) => dispatch => {
  axios
    .post("/api/shifts/delete", {
      name: shiftName
    })
    .then((error, data) => {
      if (error) {
        console.log(error)
      } else {
        console.log(data)
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const createShift = (shiftID, organization, start, end, capacity) => dispatch => {
  axios
    .post("/api/shifts/create", {
      shiftID: shiftID,
      organization: organization,
      start: start,
      end: end,
      capacity: capacity,
    })
    .then((error, data) => {
      if (error) {
        console.log(error)
      } else {
        console.log(data)
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};