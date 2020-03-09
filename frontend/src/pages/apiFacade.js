import decode from 'jwt-decode';

//Allow this to run both on http and https
const URL = window.location.protocol + require("../../package.json").serverURL;

function handleHttpErrors(res) {
  if (!res.ok) {
    const err = { message: res.statusText, status: res.status }
    throw err;
  }
  return res.json();
}

class ApiFacade {
  constructor() {
    this.role = null;
  }
  setToken = (token) => {
    localStorage.setItem('jwtToken', token)
  }
  getToken = () => {
    return localStorage.getItem('jwtToken')
  }

  isUser() {
    const profile = this.getProfile();
    return profile != null ? profile.roles.indexOf("User") >= 0 : false;
  }
  isAdmin() {
    const profile = this.getProfile();
    return profile != null ? profile.roles.indexOf("Admin") >= 0 : false;
  }


  loggedInAs = () => {
    const loggedIn = this.getToken() != null;
    const token = this.getToken();
    if (token == null) {
      return null;
    }
    const profile = decode(token);
    if (profile.roles.indexOf("Admin") >= 0) {
      return "admin";
    }
    if (profile.roles.indexOf("admin") >= 0) {
      return "admin";
    }
    if (profile.roles.indexOf("User") >= 0) {
      return "user";
    }
    if (profile.roles.indexOf("user") >= 0) {
      return "user";
    }
    return null;
  }

  logout = () => {
    this.role = null;
    localStorage.removeItem("jwtToken");
  }

  login = (user, pass) => {
    console.log("--->", URL)
    const options = this.makeFetchOptions("POST", { username: user, password: pass });
    return fetch(URL + "api/login", options, true)
      .then(handleHttpErrors)
      .then(res => { this.setToken(res.token) })

  }

  fetchData = () => {
    const options = this.makeFetchOptions("GET");
    return fetch(URL + "api/info/" + this.loggedInAs(), options).then(handleHttpErrors);
  }

  makeFetchOptions = (type, b) => {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    const role = this.loggedInAs();
    if (this.loggedInAs()) {
      headers["x-access-token"] = this.getToken();

    }
    return {
      method: type,
      headers,
      body: JSON.stringify(b)
    }
  }
}
const facade = new ApiFacade();
export default facade;