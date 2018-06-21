import React, { Component } from 'react';
import CourseChoice from '../components/CourseChoice';
import { Course, User } from "../Data";

class CourseSelect extends Component {

	constructor(props) {
		super(props);
		this.state = {
			maxChoices: 3,
			courses: [],
			choices: [],
			style: {
				overflowY:"scroll",
			}
		}

	}

	componentWillMount() {
		Promise.all([User.getChoices(this.props.token),Course.getChoices()]).then((data)=> {
			this.setState({choices:data[0],courses:data[1]});
		});
	}

	handleCourseChoose(course) {
		const index = this.state.choices.indexOf(course.key)
		if (index === -1) {
			this.setState({
				choices: this.state.choices.concat(course.key),
			});
		} else {
			let c = this.state.choices.slice();
			c.splice(index, 1);
			this.setState({
				choices: c,
			});
		}

	}

	render() {
		var courses = this.state.courses.map((course) => {
			return <CourseChoice
				key={course.key}
				course={course}
				choices={this.state.choices}
				onChoose={this.handleCourseChoose.bind(this)}
				maxChoices={this.state.maxChoices}
			/>
		});

		return (
			<div className="Page" style={this.state.style}>
				{courses}
			</div>
		);
	}
}

export default CourseSelect;

