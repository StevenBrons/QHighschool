import React, { Component } from "react";
import "./Course.css";

function formatCourseId(courseId = "") {
  return "M" + (courseId + "").padStart(4, "0");
}

class Course extends Component {
  constructor(props) {
    super(props);
    const colors = [
      " purple",
      " pink",
      " blue",
      " orange",
      " red",
      " green",
      " yellow"
    ];
    const color = colors[Math.floor(Math.random() * 7)];
    this.state = {
      color: color
    };
  }

  render() {
    const { selected, large, text, onClick, courseId } = this.props;
    const color = this.state.color;
    return (
      <div
        className={
          "Course" +
          (large ? " large" : "") +
          (selected ? " selected" : "") +
          color
        }
        onClick={onClick}
        style={{
          backgroundImage: `url(https://q-highschool.nl/images/thumbnails/${formatCourseId(
            courseId
          )}.jpg), url(https://q-highschool.nl/images/thumbnails/default.jpg)`
        }}
      >
        <h2 className="text">{text}</h2>
        <img className="q-logo" src="q.svg" alt="" />
        {selected && <div className="arrow" />}
      </div>
    );
  }
}

export default Course;
