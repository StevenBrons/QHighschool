import React, { Component } from "react";
import Course from "./Course";
import "./CourseGroup.css";

const COLORS = [
  "purple",
  "pink",
  "blue",
  "orange",
  "red",
  "green",
  "yellow"
];

class CourseGroup extends Component {
  constructor(props) {
    super(props);
    this.scroller = React.createRef();
    this.title = React.createRef();
    let coursesPerPage = window.innerWidth <= 700 ? 2 : 4; // mobile : desktop
    let maxPage = Math.floor((Object.keys(props.courses).length - 1) / coursesPerPage);
    let colors = this.randomColors(Object.keys(props.courses).length)
    this.state = {
      page: 0,
      maxPage: maxPage,
      coursesPerPage: coursesPerPage,
      colors: colors
    };

    window.addEventListener("resize", (e) => {
      // in case on mobile, we shouldn't readjust the pages
      if (!(window.matchMedia('(pointer: coarse)').matches)) {
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
        } else if (window.innerWidth <= 700 && this.state.coursesPerPage === 4) {
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

  randomColors(n) {
    let res = [COLORS[Math.floor(Math.random() * 7)]]
    for (let i = 1; i < n; i++) {
      let colors = COLORS.slice()
      colors.splice(colors.indexOf(res[res.length - 1]), 1) // remove last color from pool
      res.push(colors[Math.floor(Math.random() * 6)])
    }
    return res
  }

  scrollToPage(page) {
    let scroller = this.scroller.current;
    const margin = this.title.current.offsetLeft;
    scroller.scrollTo({ left: scroller.children[this.state.coursesPerPage * page].offsetLeft - margin, behavior: 'smooth' });
    this.setState({
      page: page
    });
  }

  getSortedCourseIds(courses) {// course objects -> ordered course ids
    let ids = Object.keys(courses).sort((a, b) => {
      let startYear = new RegExp(/(\d{4})\//) // '2019/2020' => 2019
      let yearA = parseInt(courses[a].schoolYear.match(startYear)[1])
      let yearB = parseInt(courses[b].schoolYear.match(startYear)[1])

      if (yearA === yearB) {
        let periodA = courses[a].period
        let periodB = courses[b].period

        if (periodA === periodB) {
          return 0
        }
        return periodA - periodB
      }
      return yearA - yearB
    })
    return ids
  }

  render() {
    const { courses, selectedCourse, showSubjectInfo } = this.props;
    const { page, maxPage, colors } = this.state;
    return (
      <div className="CourseGroup">
        <div className="title-container">
          <h3 className="title" ref={this.title}>
            {this.props.title}
          </h3>
          <div/> 
        </div>
        {page !== 0 && (
          <div
            className="scroll-button left"
            onClick={() => this.scrollToPage(page - 1)}
          />
        )}
        <div className="scroller" ref={this.scroller}>
          {this.getSortedCourseIds(courses).map((id, i) => {
            return (
              <Course
                key={id}
                groupId={id}
                courseId={courses[id].courseId}
                class="course"
                onClick={_ => this.props.onClick(id)}
                text={courses[id].courseName.toUpperCase()}
                selected={selectedCourse === id}
                large={this.props.large}
                color={colors[i]}
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
