import React, { Component } from 'react';
import './Page.css';
import CourseInfo from './components/CourseInfo';
import CourseGroup from './components/CourseGroup';


class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popOut: null,
    }
  }

  onClick = (course, group) => {
    console.log('course ' + course + ' in group ' + group + ' got clicked');
    this.setState({
      popOut: {
        course: course,
        group: group,
      }
    })
  }

  render() {
    return (
      <div className='Page'>
        {['Wiskunde D', 'Wiskunde C', 'Avonturen', 'Informatica', 'Spaans'].map(group =>
          <>
            <CourseGroup title={group} onClick={course => this.onClick(course,group)} className='course-group' />
            <CourseInfo />
          </>
        )}
      </div>
    )
  }
}

export default Page;
