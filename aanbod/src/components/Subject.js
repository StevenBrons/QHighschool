import React, { Component } from "react";
import Group from "./Group";
import "./Subject.css";

const COLORS = [
  "purple",
  "pink",
  "blue",
  "orange",
  "red",
  "green",
  "yellow"
];

class Subject extends Component {
  constructor(props) {
    super(props);
    this.scroller = React.createRef();
    this.title = React.createRef();
    let groupsPerPage = window.innerWidth <= 700 ? 2 : 4; // mobile : desktop
    let maxPage = Math.floor((Object.keys(props.groups).length - 1) / groupsPerPage);
    let colors = this.randomColors(Object.keys(props.groups).length)
    this.state = {
      page: 0,
      maxPage: maxPage,
      groupsPerPage: groupsPerPage,
      colors: colors
    };

    window.addEventListener("resize", (e) => {
      // in case on mobile, we shouldn't readjust the pages
      if (!(window.matchMedia('(pointer: coarse)').matches)) {
        // Check if resize changed the amount of groups displayed per page 
        if (window.innerWidth > 700 && this.state.groupsPerPage === 2) {
          let page = Math.floor(this.state.page / 2);
          let groupsPerPage = 4;
          let maxPage = Math.floor((Object.keys(this.props.groups).length - 1) / groupsPerPage);
          this.setState({
            page: page,
            groupsPerPage: groupsPerPage,
            maxPage: maxPage,
          })
        } else if (window.innerWidth <= 700 && this.state.groupsPerPage === 4) {
          let page = this.state.page * 2;
          let groupsPerPage = 2;
          let maxPage = Math.floor((Object.keys(this.props.groups).length - 1) / groupsPerPage);
          this.setState({
            page: page,
            groupsPerPage: groupsPerPage,
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
    scroller.scrollTo({ left: scroller.children[this.state.groupsPerPage * page].offsetLeft - margin, behavior: 'smooth' });
    this.setState({
      page: page
    });
  }

  getSortedGroupIds(groups) {// group objects -> ordered group ids
    let ids = Object.keys(groups).sort((a, b) => {
      let startYear = new RegExp(/(\d{4})\//) // '2019/2020' => 2019
      let yearA = parseInt(groups[a].schoolYear.match(startYear)[1])
      let yearB = parseInt(groups[b].schoolYear.match(startYear)[1])

      if (yearA === yearB) {
        let periodA = groups[a].period
        let periodB = groups[b].period

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
    const { groups, selectedGroup, showSubjectInfo, title } = this.props;
    const { page, maxPage, colors } = this.state;
    return (
      <div className="Subject">
        <div className="title-container">
          <h3 className="title" ref={this.title}>
            {title}
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
          {this.getSortedGroupIds(groups).map((id, i) => {
            return (
              <Group
                key={id}
                groupId={id}
                courseId={groups[id].courseId}
                class="group"
                onClick={_ => this.props.onClick(id)}
                text={groups[id].courseName.toUpperCase()}
                selected={selectedGroup === id}
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

export default Subject;
