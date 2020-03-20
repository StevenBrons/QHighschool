import React, { Component } from 'react';
import './CourseInfo.css';

function formatCourseId(courseId = "") { // done this ugly because of internet explorer
  if (courseId >= 1000)
    return "M" + courseId
  if (courseId >= 100) 
    return "M0" + courseId
  if (courseId >= 10)
    return "M00" + courseId
  return "M000" + courseId
}

class CourseInfo extends Component {
	constructor(props) {
		super(props);
		this.ref = React.createRef();
	}

	componentDidMount() {
		// scroll courseinfo to center
		window.scrollTo({ top: this.ref.current.offsetTop - window.innerHeight * 0.05, behavior: 'smooth' })
	}

	render() {
		const course = this.props.course;
		const id = course.id;
		return (
			<div className='CourseInfo' ref={this.ref}>
				<div className='text-and-image' >
					<div className='info-text'>
						<h1 className='title'>
							{course.courseName.toUpperCase()}
						</h1>
						<div className='period'>
							<div className='square' />
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
							onClick={() => { window.open(`https://app.q-highschool.nl/aanbod?vak=${course.subjectName}&blok=${course.period}&leerjaar=${course.schoolYear}`) }}
						>
							AANMELDEN
					</button>
					</div>
					<div
						className='image'
						style={{
							background: `url(https://q-highschool.nl/images/thumbnails/${formatCourseId(course.courseId)}.jpg), url(https://q-highschool.nl/images/thumbnails/default.jpg) no-repeat`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'cover',
							backgroundPosition: 'center center'
						}} />
					<button
						className='close-button'
						onClick={this.props.onClose}
					/>
				</div>
				<div className='extra-info'>
					<p className='extra-info-text'><b>Dag:</b> {course.day} </p>
					{/* <p className = 'extra-info-text'><b>Tijd:</b> {course.time}</p> */}
					<p className='extra-info-text'><b>Doelgroep:</b> {course.enrollableFor} </p>
				</div>
			</div>
		)
	}
}

export default CourseInfo;
