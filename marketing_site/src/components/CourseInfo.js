import React, { Component } from 'react';
import './CourseInfo.css';

class CourseInfo extends Component {

  render() {
	const course = this.props.course;
    return (
      <div className='CourseInfo'>
		  <h1>
			  Informatie over module {course.courseName} van {course.subjectName}
		  </h1>
		  <p>
			  Beschrijving: {course.courseDescription} <br/>
			  Leraar: {course.teacherName} <br/>
			  Studietijd: {course.studyTime} <br/>
			  Voorkennis: {course.remarks} <br/>
			  Doelgroep: {course.enrollableFor} <br/>
			  Periode: {course.period} <br/>
			  Dag: {course.day} <br/>
		  </p>
		  <button onClick={this.props.onClose}>
			  X
		  </button>
      </div>
    )
  }
}

export default CourseInfo;
