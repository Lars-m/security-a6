import decode from 'jwt-decode';
const URL = require("../../package.json").serverURL;
console.log("URL", URL);

class AuthService {


  login = (username, password) => {
    console.log("XXXXXXXXXXXXXXX")
    return this.fetch(`${URL}/api/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => {
      this.setToken(res.token) // Setting the token in localStorage
      return Promise.resolve(res);
    })
  }

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token) // handwaiving here
  }

  isTokenExpired(token) {
    try {
      const expInMS = decode(token).exp * 1000;
      if (expInMS < Date.now()) { // Checking if token is expired. N
        return true;
      }
      else
        return false;
    }
    catch (err) {
      return false;
    }
  }

  setToken = (idToken) => {
    localStorage.setItem('id_token', idToken)
  }

  getToken = () => {
    return localStorage.getItem('id_token')
  }

  logout() {
    localStorage.removeItem('id_token');
  }

  getUserName() {
    const profile = this.getProfile();
    return profile !== null ? profile.username : "";
  }
  isUser() {
    const profile = this.getProfile();
    return profile != null ? profile.roles.indexOf("User") >= 0 : false;
  }
  isAdmin() {
    const profile = this.getProfile();
    return profile != null ? profile.roles.indexOf("Admin") >= 0 : false;
  }
  getProfile() {
    if (this.isTokenExpired(this.getToken())) {
      return null;
    }
    // Using jwt-decode npm package to decode the token
    const token = this.getToken();
    return token != null ? decode(token) : null;
  }

  // performs api calls sending the required authentication headers
  fetch = (url, options, skipAuthorizationHeader) => {

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Set the Authorization header
    if (this.loggedIn() && !skipAuthorizationHeader) {
      headers['x-access-token'] = this.getToken()
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json())
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response
    } else {
      var error = { message: response.statusText };
      error.response = response.json();
      error.status = response.status;
      throw error
    }
  }
}

const auth = new AuthService();

//export default auth;