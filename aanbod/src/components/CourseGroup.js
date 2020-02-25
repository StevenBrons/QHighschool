import React, { Component } from "react";
import Course from "./Course";
import "./CourseGroup.css";

class CourseGroup extends Component {
  constructor(props) {
    super(props);
    this.scroller = React.createRef();
    this.title = React.createRef();
    let coursesPerPage = window.innerWidth <= 700 ? 2 : 4 ; // mobile : desktop
    let maxPage = Math.floor((Object.keys(props.courses).length - 1) / coursesPerPage);
    this.state = {
      page: 0,
      maxPage: maxPage,
      coursesPerPage: coursesPerPage,
    };
    window.addEventListener("resize", (e) => {
      // in case on mobile, we shouldn't readjust the pages
      console.log(e)
      if (!(window.matchMedia('(pointer: coarse)').matches)){
        // Check if resize changed the amount of courses displayed per page 
        if (window.innerWidth > 700 && this.state.coursesPerPage === 2) {
          let page = Math.floor(this.state.page / 2);
          let coursesPerPage = 4;
          let maxPage = Math.floor((Object.keys(this.props.courses).length - 1) / coursesPerPage);
          this.setState({
            page: page,
            coursesPerPage: coursesPerPage,
            maxPage: maxPage,
          })
        } else if (window.innerWidth <= 700 && this.state.coursesPerPage === 4){
          let page = this.state.page * 2;
          let coursesPerPage = 2;
          let maxPage = Math.floor((Object.keys(this.props.courses).length - 1) / coursesPerPage);
          this.setState({
            page: page,
            coursesPerPage: coursesPerPage,
            maxPage: maxPage,
          })
        }
        this.scrollToPage(this.state.page);
      } 
    });
  }

  scrollToPage(page) {
    let scroller = this.scroller.current;
    const margin = this.title.current.offsetLeft;
    scroller.scrollLeft = scroller.children[this.state.coursesPerPage * page].offsetLeft - margin;
    this.setState({
      page: page
    });
  }

  render() {
    const { courses, selectedCourse, showSubjectInfo } = this.props;
    const { page, maxPage } = this.state;
    return (
      <div className="CourseGroup">
        <h3 className="title" ref={this.title} onClick={showSubjectInfo}>
          {this.props.title}
        </h3>
        {page !== 0 && (
          <div
            className="scroll-button left"
            onClick={() => this.scrollToPage(page - 1)}
          />
        )}
        <div className="scroller" ref={this.scroller}>
          {Object.keys(courses).map(id => {
            return (
              <Course
                key={id}
                courseId={courses[id].courseId}
                class="course"
                onClick={_ => this.props.onClick(id)}
                text={courses[id].courseName.toUpperCase()}
                selected={selectedCourse === id}
                large={this.props.large}
              />
            );
          })}
        </div>
        {page !== maxPage && (
          <div
            className="scroll-button right"
            onClick={() => this.scrollToPage(page + 1)}
          />
        )}
      </div>
    );
  }
}

export default CourseGroup;
