import React, { Component } from "react"
import facade from "./apiFacade";

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "",error:"" }
  }

  login = (evt) => {
    evt.preventDefault();
    this.setState({error : ""})
    this.props.login(this.state.username, this.state.password)
    .catch(err=>{
      this.setState({error : "Wrong Username or Password"});
    });
  }

  onChange = (evt) => {
    this.setState({[evt.target.id]: evt.target.value})
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.login} onChange={this.onChange} >
          <input placeholder="User Name" id="username" />
          <input placeholder="Password" id="password" />
          <button>Login</button>
        </form>
        <div style={{color:"red",marginTop:15}}>{this.state.error}</div>
      </div>
    )
  }
}
class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state= {dataFromServer: "Fetching!!"};
  }
  componentDidMount(){
    facade.fetchData()
    .then(res=> this.setState({dataFromServer: res}));
  }

  render() {
    return (
      <div>
        <h2>Data Received from server</h2>
        <h3>{this.state.dataFromServer}</h3>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false }
  }

  logout = () => {
    facade.logout();
    this.setState({ loggedIn: false });
  }

  login = (user, pass) => {
     return facade.login(user,pass).then(res =>this.setState({ loggedIn: true }));
  }

  render() {
    const loggedIn = this.state.loggedIn;
    return (
      <div>
        {!loggedIn ? (<LogIn login={this.login} />) :
          (
            <div>
              <LoggedIn/>
              <button onClick={this.logout}>Logout</button>
            </div>
        )
        }
      </div>
    )
  }
}
export default App;