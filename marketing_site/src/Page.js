import React, { Component } from 'react';
import './Page.css';
import CourseGroup from './components/CourseGroup';

class Page extends Component {
  render() {
    return (
      <div class='Page'>
        <CourseGroup title={'Wiskunde D'} class='course-group' />
        <CourseGroup title={'Wiskunde C'} class='course-group' />
        <CourseGroup title={'Avonturen'} class='course-group' />
        <CourseGroup title={'Informatica'} class='course-group'/>
        <CourseGroup title={'Spaans'} class='course-group' />
      </div>
    )
  }
}

export default Page;
