import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import "./style.css";
import "./layout.css";

import Login from "./pages/Login";
import Header from "./components/Header";
import Menu from "./components/Menu";
import CourseSelect from "./pages/CourseSelect";


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
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

  handleLogin(event) {
    event.preventDefault();
    this.setState({ email: event.target.elements[0].value });
  }

  render() {
    return (
      <Router>
        <div className="App" style={{ backgroundColor: "white" }}>
          <Header email={this.state.user.email} />
          <Menu pages={this.state.pages} />
          <Switch>
            <Route path="/course-select" component={CourseSelect} />
            <Redirect to="/course-select" />
          </Switch>
        </div>
      </Router>

    );
  }

}

export default App;
