import React, { Component } from 'react';
import './GroupInfo.css';

function formatCourseId(courseId = "") { // done this ugly because of internet explorer
  if (courseId >= 1000)
    return "M" + courseId
  if (courseId >= 100) 
    return "M0" + courseId
  if (courseId >= 10)
    return "M00" + courseId
  return "M000" + courseId
}

class GroupInfo extends Component {
	constructor(props) {
		super(props);
		this.ref = React.createRef();
	}

	componentDidMount() {
		let scrollDestination = this.ref.current.offsetTop - window.innerHeight * 0.05
		window.scrollTo({ top: scrollDestination, behavior: 'smooth' })
	}

	componentWillUnmount() {
		if (window.scrollY > this.ref.current.offsetTop) {
			window.scrollBy({top: -(0.9 * this.ref.current.offsetHeight), behavior: 'smooth'})
		}
	}

	render() {
		const group = this.props.group;
		return (
			<div className='GroupInfo' ref={this.ref}>
				<div className='text-and-image' >
					<div className='info-text'>
						<h1 className='title'>
							{group.courseName.toUpperCase()}
						</h1>
						<div className='period'>
							<div className='square' />
							<p className='number'>
								Blok {group.period}
							</p>
						</div>

						<p className='description-title'>
							Module: Beschrijving
					</p>

						<p>
							{group.courseDescription}
						</p>

						<button
							className='enroll-button'
							onClick={() => { window.open(`https://app.q-highschool.nl/aanbod?vak=${group.subjectName}&blok=${group.period}&leerjaar=${group.schoolYear}`) }}
						>
							AANMELDEN
					</button>
					</div>
					<div
						className='image'
						style={{
							background: `url(https://q-highschool.nl/images/thumbnails/${formatCourseId(group.courseId)}.jpg), url(https://q-highschool.nl/images/thumbnails/default.jpg) no-repeat`,
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
					<p className='extra-info-text'><b>Dag:</b> {group.day} </p>
					{/* <p className = 'extra-info-text'><b>Tijd:</b> {group.time}</p> */}
					<p className='extra-info-text'><b>Doelgroep:</b> {group.enrollableFor} </p>
				</div>
			</div>
		)
	}
}

export default GroupInfo;
