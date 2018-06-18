import React, { Component } from "react";
import "./style.css";
import "./layout.css";

import Login from "./Login";
import Header from "./Header";
import Menu from "./Menu";
import CourseSelect from "./CourseSelect";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      chosenCourcesCount:0,
      minCourses:2,
      maxCources:2,
      courses: [
        {
            title: "Informatica",
            period: 3,
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
            chosen: false,
            chosenNum: 0,
        },
        {
            title: "Filosofie",
            period: 3,
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
            chosen: false,
            chosenNum: 0,
        },
        {
            title: "Spaans",
            period: 3,
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
            chosen: false,
            chosenNum: 0,
        },
        {
            title: "Tekenen",
            period: 3,
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
            chosen: false,
            chosenNum: 0,
        },
    ],
    };
  }

  handleLogin(event) {
    event.preventDefault();
    this.setState({email:event.target.elements[0].value});
  }

  handleCourceChoose(cource) {
    var courses = this.state.courses;
    let i = this.state.courses.indexOf(cource);
    courses[i].chosen = !courses[i].chosen;
    let c = this.countChosenCources(courses);
    courses[i].chosenNum = c;
    this.setState({
      courses:courses,
      chosenCourcesCount:c,
    });
    
  }

  countChosenCources(courses) {
    let i = 0;
    for(let c of courses) {
      if (c.chosen === true) {
        i++;
      }
    }
    return i;
  }

  render() {
    if (this.state.email === "") {
      return (
        <div className="App" style={{backgroundColor: "#03A9F4"}}>
          <Login onSubmit={this.handleLogin.bind(this)}/>
        </div>
      );
    }else {
      return (
        <div className="App" style={{backgroundColor: "white"}}>
          <Header email={this.state.email}/>
          <Menu notifications={(this.state.minCourses - this.state.chosenCourcesCount)}/>
          <CourseSelect
            onChoose={this.handleCourceChoose.bind(this)}
            courses={this.state.courses}
            maxCources={this.state.maxCources}
            chosenCourcesCount={this.state.chosenCourcesCount}
          />
        </div>
      );
    }
  }
}

export default App;
