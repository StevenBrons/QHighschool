import React, { Component } from "react";
import "./Group.css";

function formatCourseId(courseId = "") { // done this ugly because of internet explorer
  if (courseId >= 1000)
    return "M" + courseId
  if (courseId >= 100) 
    return "M0" + courseId
  if (courseId >= 10)
    return "M00" + courseId
  return "M000" + courseId
}

class Group extends Component {
  render() {
    const { selected, large, text, onClick, courseId } = this.props;
    const color = this.props.color;
    return (
      <div
        className={
          "Group" +
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

export default Group;
