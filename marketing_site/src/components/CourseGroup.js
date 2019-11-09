import React, {Component} from 'react';
import Course from './Course';
import './CourseGroup.css'; 

class CourseGroup extends Component {

	render() {
		const {courses, selectedCourse} = this.props;
		return (
			<div className='CourseGroup'>
				<h3
					className='title'
					onClick={()=>{}}//TODO
				>
					{this.props.title}
				</h3>
				<div>
					{Object.keys(courses).map(id => {
						return <Course 
									key={id} 
									class='course' 
									onClick={_ => this.props.onClick(id)} 
									text={courses[id].courseName} 
									selected = {selectedCourse === id}
									large = {this.props.large}
								/>
					})}
				</div>
			</div>
		)
	}
}

export default CourseGroup;