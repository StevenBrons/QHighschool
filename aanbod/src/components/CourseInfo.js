import React, { Component } from 'react';
import './CourseInfo.css';

class CourseInfo extends Component {

  render() {
		const course = this.props.course;
		const id = course.id;
    return (
      <div className='CourseInfo'>
				<div className='info-text'>
					<h1 className='title'>
						{course.courseName.toUpperCase()}
					</h1>
					<div className='period'>
						<div className='square'/>
						<p className='number'>
							Blok {course.period}
						</p>
					</div>

					<p className='description-title'>
						Module: Beschrijving
					</p>

					<p>
						{course.courseDescription}
					</p>

					<button 
						className='enroll-button'
						onClick={() => {window.open(`https://app.q-highschool.nl/aanbod?vak=${course.subjectName}&blok=${course.period}&leerjaar=${course.schoolYear}`)}}
					>
						AANMELDEN
					</button>
				</div>
				<div 
					className='image' 
					style={{background:`url(https://q-highschool.nl/wp-content/uploads/thumbnail_course_${id}.jpg), url(https://q-highschool.nl/wp-content/uploads/thumbnail_fallback.jpg) no-repeat`,
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'cover',
									backgroundPosition:'center right'}}/>
				<button 
					className='close-button' 
					onClick={this.props.onClose} 
				/>
      </div>
    )
  }
}

export default CourseInfo;
