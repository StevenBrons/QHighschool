import React, { Component } from 'react';
import './Page.css';
import CourseInfo from './components/CourseInfo';
import CourseGroup from './components/CourseGroup';
import Header from './components/Header';
import fetchData from './fetchData';


class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popOut: null,
      courses: null,
    }
  }

  componentDidMount = () => {
    fetchData().then(courses => this.setState({courses: courses}))
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

  render() {
    const {popOut, courses} = this.state;
    if (!courses) {
      return(
        <h1>
          Laden...
        </h1>
      )
    }
    return (
      <div className='Page'>
        <Header />
        {Object.keys(courses).map(subject =>
          <>
            <CourseGroup 
              title={subject} 
              courses={courses[subject]}
              onClick={courseId => this.onClick(courseId,subject)} 
              className='course-group' 
              large = {subject === 'Spaans'}
            />
            {popOut && popOut.group === subject && 
              <CourseInfo 
                course={courses[popOut.group][popOut.courseId]} 
                group={subject} 
                onClose={_ => this.onClick(popOut.courseId, popOut.group)} 
              />  
            }
          </>
        )}
      </div>
    )
  }
}

export default Page;
