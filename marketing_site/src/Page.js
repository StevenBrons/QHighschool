import React, { Component } from 'react';
import './Page.css';
import CourseGroup from './components/CourseGroup';

class Page extends Component {
  render() {
    return (
      <div class='Page'>
        <CourseGroup style={{margin:'15px'}}/>
        <CourseGroup style={{margin:'15px'}}/>
        <CourseGroup style={{margin:'15px'}}/>
        <CourseGroup style={{margin:'15px'}}/>
        <CourseGroup style={{margin:'15px'}}/>
      </div>
    )
  }
}

export default Page;
