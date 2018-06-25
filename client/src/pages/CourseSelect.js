import React from 'react';
import Page from './Page';
import SubjectComponent from '../components/Subject';
import { Course, User, Subject } from "../Data";

class CourseSelect extends Page {

	constructor(props) {
		super(props);
		this.state = {
			courses: [],
			choices: [],
			possibleChoices: [],
			subjects: [],
			style: {
				overflowY: "scroll",
			}
		}

	}

	componentWillMount() {
		Promise.all([User.getChoices(), Course.getList(), Subject.getList(), User.getPossibleChoices()]).then((data) => {
			this.setState({ choices: data[0], courses: data[1], subjects: data[2],possibleChoices: data[3]});
		});
	}

	indexOfCourse(course) {
		let index = -1;
		this.state.choices.map((c,i) => {
			if (c.id === course.id) {
				index = i;
			}
			return 0;
		});
		return index;
	}

	async handleCourseChoose(course) {
		const index = this.indexOfCourse(course);
		if (index === -1) {
			await User.addChoice(course.id).then(() => {
				this.setState({
					choices: this.state.choices.concat(course),
				});
			});
		} else {
			let c = this.state.choices.slice();
			c.splice(index, 1);
			await User.removeChoice(course.id).then(() => {
				this.setState({
					choices: c,
				});
			});
		}
	}

	getCoursesPerSubject(subject) {
		return this.state.courses.filter(course => {
			return (subject.id === course.subjectId);
		});
	}

	render() {
		var subjects = this.state.subjects.map((subject) => {
			return <SubjectComponent
				key={subject.id}
				subject={subject}
				extended={false}
				courses={this.getCoursesPerSubject.bind(this)(subject)}
				choices={this.state.choices}
				onChoose={this.handleCourseChoose.bind(this)}
				possibleChoices={this.state.possibleChoices}
			/>
		});

		return (
			<div className="Page" style={this.state.style}>
				{subjects}
			</div>
		);
	}
}

export default CourseSelect;

