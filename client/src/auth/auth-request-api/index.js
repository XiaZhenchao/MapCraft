/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://mapcraft-55160ee4aae1.herokuapp.com/auth'
  : 'http://localhost:4000/auth';
const api = axios.create({
    baseURL,
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email : email,
        password : password
    })
}
export const logoutUser = () => api.get(`/logout/`)

export const registerUser = (firstName, lastName, email, password, passwordVerify, role) => {
    return api.post(`/register/`, {
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password,
        passwordVerify : passwordVerify,
        role: "user"
    })
}

export const forgotPassword = (email) => {
    console.log("forgotPassword444");
    return api.post(`/forgot-password`, { email: email })
        .then(response => {
            console.log("Response data: ", response.data);
            return response.data; // Returning the data from the resolved Promise
        })
        .catch(error => {
            console.error("Error in forgotPassword:", error);
            throw error;
        });
};

export const resetPassword = (newPassword, verifyNewPassword, resetToken) => {
    console.log("resetPassword444");
    return api.put(`/reset-password/`, {
        newPassword: newPassword,
        verifyNewPassword: verifyNewPassword,
        resetToken: resetToken // Include the resetToken here
    })
    .then(response => {
        console.log("Response data: ", response.data);
        return response.data; // Returning the data from the resolved Promise
    })
    .catch(error => {
        console.error("Error in resetPassword:", error);
        throw error;
    });
};
export const banUserByEmail = (email) => {
    return api.post('/banUser', { email })
      .then(response => {
        console.log("User banned successfully");
        return response.data; // Return the data from the resolved Promise
      })
      .catch(error => {
        console.error("Error banning user by email:", error);
        throw error;
      });
  };

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    banUserByEmail,
}

export default apis
