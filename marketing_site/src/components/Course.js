import React, {Component} from 'react';
import './Course.css';

class Course extends Component {

	render() {
		console.log(this.props);
		return (
			<button class='Course'>
				Dit is een course {this.props.text}
			</button>
		)
	}
}

export default Course;