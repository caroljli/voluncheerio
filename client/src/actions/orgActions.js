import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS } from "./types";

// delete org
export const deleteOrg = (orgName) => dispatch => {
  axios
    .post("/api/organizations/delete", {
      name: orgName
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

export const createOrg = (
  name, 
  admins,
  about,
  email,
  phone,
  picture
) => dispatch => {
  axios
    .post("/api/organizations/create", {
      name: name,
      admins: admins,
      about: about,
      email: email,
      phone: phone,
      picture: picture
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

export const getOrgs = () => dispatch => {
  axios
    .get("/api/organizations/")
    .then(result => {
      console.log(result.data.data)
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
// export const loginUser = userData => dispatch => {
//   axios
//     .post("/api/users/login", userData)
//     .then(res => {
//       // Save to localStorage

//       // Set token to localStorage
//       const { token } = res.data;
//       localStorage.setItem("jwtToken", token);
//       // Set token to Auth header
//       setAuthToken(token);
//       // Decode token to get user data
//       const decoded = jwt_decode(token);
//       // Set current user
//       dispatch(setCurrentUser(decoded));
//     })
//     .catch(err => {
//       console.log(err)
//         dispatch({
//           type: GET_ERRORS,
//           payload: err.response.data
//         })
//       }
//     );
// };

// Set logged in user
// export const setCurrentUser = decoded => {
//   return {
//     type: SET_CURRENT_USER,
//     payload: decoded
//   };
// };

// // User loading
// export const setUserLoading = () => {
//   return {
//     type: USER_LOADING
//   };
// };

// // Log user out
// export const logoutUser = () => dispatch => {
//   // Remove token from local storage
//   localStorage.removeItem("jwtToken");
//   // Remove auth header for future requests
//   setAuthToken(false);
//   // Set current user to empty object {} which will set isAuthenticated to false
//   dispatch(setCurrentUser({}));
// };
