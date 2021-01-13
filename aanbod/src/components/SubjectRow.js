import React, { Component } from "react";
import Course from "./Course";
import "./SubjectRow.css";

const COLORS = [
  "purple",
  "pink",
  "blue",
  "orange",
  "red",
  "green",
  "yellow"
];

const ENROLLMENT_PERIOD = 3;

class SubjectRow extends Component {
  constructor(props) {
    super(props);
    this.scroller = React.createRef();
    this.title = React.createRef();
    let coursesPerPage = window.innerWidth <= 700 ? 2 : 4; // mobile : desktop
    let maxPage = Math.floor((Object.keys(props.groups).length - 1) / coursesPerPage);
    let colors = this.randomColors(Object.keys(props.groups).length)
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
          let maxPage = Math.floor((Object.keys(this.props.groups).length - 1) / coursesPerPage);
          this.setState({
            page: page,
            coursesPerPage: coursesPerPage,
            maxPage: maxPage,
          })
        } else if (window.innerWidth <= 700 && this.state.coursesPerPage === 4) {
          let page = this.state.page * 2;
          let coursesPerPage = 2;
          let maxPage = Math.floor((Object.keys(this.props.groups).length - 1) / coursesPerPage);
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

  getSortedGroups(groups) {// course objects -> filtered and ordered groups
    return Object.keys(groups)
      .map(id => groups[id])
      .filter(({ period }) => period >= ENROLLMENT_PERIOD)
      .sort((a, b) => {
        let startYear = new RegExp(/(\d{4})\//); // '2019/2020' => 2019
        let yearA = parseInt(a.schoolYear.match(startYear)[1]);
        let yearB = parseInt(b.schoolYear.match(startYear)[1]);
        return parseInt(`${yearA}${a.period}${a.courseDescription.charCodeAt(0)}`) - parseInt(`${yearB}${b.period}${b.courseDescription.charCodeAt(0)}`);
      });
  }

  render() {
    const { groups, selectedCourse, showSubjectInfo } = this.props;
    const { page, maxPage, colors } = this.state;
    return (
      <div className="SubjectRow">
        <h3 className="title" ref={this.title}>
          {this.props.title}
        </h3>
        {page !== 0 && (
          <div
            className="scroll-button left"
            onClick={() => this.scrollToPage(page - 1)}
          />
        )}
        <div className="scroller" ref={this.scroller}>
          {this.getSortedGroups(groups).map(({ id, courseId, courseName }, i) => {
            return (
              <Course
                key={id}
                groupId={id}
                courseId={courseId}
                class="course"
                onClick={_ => this.props.onClick(id)}
                text={courseName}
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

export default SubjectRow;
