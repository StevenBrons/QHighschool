import React, { Component } from 'react';
import './Page.css';
import GroupInfo from './components/GroupInfo';
import Subject from './components/Subject';
import SubjectInfo from './components/SubjectInfo';
// import Header from './components/Header';
import { fetchGroups, fetchSubjectInformation } from './fetchData';
import LoadIcon from './components/LoadIcon';


class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popOut: null,
      subjectInfo: null,
      groups: null,
      subjectDescriptions: null,
      serverError: false,
    }
  }

  componentDidMount = () => {
    fetchGroups(this.handleError).then(groups =>
      this.setState({ groups: groups, serverError: false }))

    fetchSubjectInformation(this.handleError).then(subjectDescriptions =>
      this.setState({ subjectDescriptions: subjectDescriptions, serverError: false }))
  }

  handleError = e => {
    console.log(e);
    this.setState({
      serverError: true,
    })
  }

  onClick = (groupId, subject) => {
    let popOut = this.state.popOut;
    if (popOut && popOut.subject === subject && popOut.groupId === groupId) {
      popOut = null;
    } else {
      popOut = {
        subject: subject,
        groupId: groupId,
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
    let { popOut, groups, subjectInfo, subjectDescriptions, serverError } = this.state;
    if (serverError) {
      return (
        <h1 className='error'>
          Er is een fout opgetreden met het verbinden met de server.
        </h1>
      )
    }
    if (!groups) {
      return (
        <LoadIcon />
      )
    }
    const subjects = Object.keys(groups).sort();
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
            <Subject
              title={subject}
              key={i}
              groups={groups[subject]}
              onClick={courseId => this.onClick(courseId, subject)}
              className='subject-group'
              selectedGroup={popOut && popOut.groupId}
              showSubjectInfo={() => this.showSubjectInfo(subject)}
            />
            {popOut && popOut.subject === subject &&
              <GroupInfo
                group={groups[popOut.subject][popOut.groupId]}
                key={Math.random()}
                subject={subject}
                onClose={_ => this.onClick(popOut.groupId, popOut.subject)}
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
