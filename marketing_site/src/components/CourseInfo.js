import React, { Component } from 'react';
import './CourseInfo.css';

class CourseInfo extends Component {

  render() {
	console.log('hoi')
    return (
      <div className='CourseInfo'>
		  <h1>
			  Informatie over module {this.props.course} van {this.props.group}
		  </h1>
      </div>
    )
  }
}

export default CourseInfo;
