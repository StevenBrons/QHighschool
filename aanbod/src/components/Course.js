import React, { Component } from "react";
import "./Course.css";

function formatCourseId(courseId = "") {
  return "M" + (courseId + "").padStart(4, "0");
}

class Course extends Component {
  render() {
    const { selected, large, text, onClick, courseId } = this.props;
    const color = this.props.color;
    return (
      <div
        className={
          "Course" +
          (large ? " large" : "") +
          (selected ? " selected" : "") +
          " " + color
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
