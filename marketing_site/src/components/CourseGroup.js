import React, {Component} from 'react';
import Course from './Course';
import './CourseGroup.css'; 

class CourseGroup extends Component {

	render() {
		return (
			<div className='CourseGroup'>
				<h2>
					{this.props.title}
				</h2>
				{[1,2,3,4,5,6,7,8,9,10].map(n => {
					return <Course 
								key={n} 
								class='course' 
								onClick={_ => this.props.onClick(n)} 
								text={n} 
								large = {this.props.large}
							/>
				})}
			</div>
		)
	}
}

export default CourseGroup;