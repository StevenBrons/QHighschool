import React, { Component } from "react";
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
      currentPage: "courseSelect",
      user: {
        email: "abc@email.com",
      }
    };
  }

  handleLogin(event) {
    event.preventDefault();
    this.setState({ email: event.target.elements[0].value });
  }

  getCurrentPage() {
    switch (this.state.currentPage) {
      case "courseSelect":
        return <CourseSelect />;
      case "login":
      return <Login />;
    }
  }

  render() {
    return (
      <div className="App" style={{ backgroundColor: "white" }}>
        <Header email={this.state.user.email} />
        <Menu/>
        {this.getCurrentPage()}
      </div>
    );
  }

}

export default App;
