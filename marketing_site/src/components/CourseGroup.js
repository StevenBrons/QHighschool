import React, {Component} from 'react';
import Course from './Course';

class CourseGroup extends Component {

	render() {
		return (
			<div style={{display:'inline-block'}}>
				{[1,2,3,4,5,6,7].map(n => {
					return <Course style={{margin:'5px'}} text={n} />
				})}
			</div>
		)
	}
}

export default CourseGroup;