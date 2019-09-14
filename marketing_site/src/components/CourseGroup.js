import React, {Component} from 'react';
import Course from './Course';
import './CourseGroup.css'; 

class CourseGroup extends Component {

	render() {
		const courses = this.props.courses;
		return (
			<div className='CourseGroup'>
				<h2>
					{this.props.title}
				</h2>
				{Object.keys(courses).map(id => {
					return <Course 
								key={id} 
								class='course' 
								onClick={_ => this.props.onClick(id)} 
								text={courses[id].courseName} 
								large = {this.props.large}
							/>
				})}
			</div>
		)
	}
}

export default CourseGroup;