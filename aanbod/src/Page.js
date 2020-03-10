import React, { Component } from 'react';
import './Page.css';
import CourseInfo from './components/CourseInfo';
import CourseGroup from './components/CourseGroup';
import SubjectInfo from './components/SubjectInfo';
// import Header from './components/Header';
import { fetchCourses, fetchSubjectInformation } from './fetchData';
import LoadIcon from './components/LoadIcon';


class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popOut: null,
      subjectInfo: null,
      courses: null,
      subjectDescriptions: null,
      serverError: false,
    }
  }

  componentDidMount = () => {
    fetchCourses(this.handleError).then(courses =>
      this.setState({ courses: courses, serverError: false }))

    fetchSubjectInformation(this.handleError).then(subjectDescriptions =>
      this.setState({ subjectDescriptions: subjectDescriptions, serverError: false }))
  }

  handleError = e => {
    console.log(e);
    this.setState({
      serverError: true,
    })
  }

  onClick = (courseId, group) => {
    let popOut = this.state.popOut;
    if (popOut && popOut.group === group && popOut.courseId === courseId) {
      popOut = null;
    } else {
      popOut = {
        group: group,
        courseId: courseId,
      }
    }
    this.setState({
      popOut: popOut,
    })
  }

  showSubjectInfo = (subject) => {
    if (subject === this.state.subjectInfo) {
      this.removeSubjectInfo();
      return;
    }
    this.setState({
      subjectInfo: subject
    })
  }

  removeSubjectInfo = () => {
    this.setState({
      subjectInfo: null
    })
  }

  render() {
    let { popOut, courses, subjectInfo, subjectDescriptions, serverError } = this.state;
    if (serverError) {
      return (
        <h1 className='error'>
          Er is een fout opgetreden met het verbinden met de server.
        </h1>
      )
    }
    if (!courses) {
      return (
        <LoadIcon />
      )
    }
    const subjects = Object.keys(courses).sort();
    let nextSubject, previousSubject;
    if (subjectInfo) {
      let subjectInfoId = subjects.indexOf(subjectInfo)
      if (subjectInfoId < subjects.length - 1) nextSubject = () => this.showSubjectInfo(subjects[subjectInfoId + 1]);
      if (subjectInfoId > 0) previousSubject = () => this.showSubjectInfo(subjects[subjectInfoId - 1]);
    }
    return (
      <div className='Page'>
        {/* <Header /> */}
        {subjectInfo &&
          <SubjectInfo
            nextSubject={nextSubject}
            previousSubject={previousSubject}
            subject={subjectInfo}
            description={subjectDescriptions[subjectInfo]}
            onClose={() => this.showSubjectInfo(null)}
          />
        }
        {subjects.map((subject, i) =>
          <React.Fragment key={i}>
            <CourseGroup
              title={subject}
              key={i}
              courses={courses[subject]}
              onClick={courseId => this.onClick(courseId, subject)}
              className='course-group'
              selectedCourse={popOut && popOut.courseId}
              showSubjectInfo={() => this.showSubjectInfo(subject)}
            />
            {popOut && popOut.group === subject &&
              <CourseInfo
                course={courses[popOut.group][popOut.courseId]}
                key={Math.random()}
                group={subject}
                onClose={_ => this.onClick(popOut.courseId, popOut.group)}
              />
            }
          </React.Fragment>
        )}
        <div style={{ height: "300px" }} />
      </div>
    )
  }
}

export default Page;
