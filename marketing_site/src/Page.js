import React, { Component } from 'react';
import './Page.css';
import CourseGroup from './components/CourseGroup';

class Page extends Component {
  render() {
    return (
      <div className='Page'>
        <CourseGroup title={'Wiskunde D'} className='course-group' />
        <CourseGroup title={'Wiskunde C'} className='course-group' />
        <CourseGroup title={'Avonturen'} className='course-group' />
        <CourseGroup title={'Informatica'} className='course-group'/>
        <CourseGroup title={'Spaans'} className='course-group' />
      </div>
    )
  }
}

export default Page;
