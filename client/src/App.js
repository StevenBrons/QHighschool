import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import {User} from "./Data";

import "./style.css";
import "./layout.css";

import Login from "./pages/Login";
import Settings from "./pages/Settings";
import CourseSelect from "./pages/CourseSelect";

import Header from "./components/Header";
import Menu from "./components/Menu";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: getCookie("token"),
      user: {
        email: "abc@email.com",
      },
      pages: [
        {
          id: "module-keuze",
          title: "Module keuze",
        },
        {
          id: "instellingen",
          title: "Instellingen",
          bottom: true,
        }
      ],
    };
  }

  componentWillMount() {
    User.getUser().then((data) => {
      console.log(data);
    });
  }

  handleLogin(event) {
    event.preventDefault();
    this.setState({ email: event.target.elements[0].value });
  }

  render() {
    console.log(document.location.href);
    if (this.state.token === null) {
      //document.location.href = "/login";
    }
    return (
      <Router>
        <div className="App" style={{ backgroundColor: "white" }}>
          <Header email={this.state.user.email} />
          {this.state.token?<Menu pages={this.state.pages} />:null}
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/module-keuze" component={CourseSelect} />
            <Route path="/instellingen" component={Settings} />
            <Redirect to="/module-keuze" />
          </Switch>
        </div>
      </Router>

    );
  }

}


function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)===' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

export default App;
