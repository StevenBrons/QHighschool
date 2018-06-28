import React from 'react';
import Page from './Page';
import SubjectComponent from '../components/Subject';
import { Group, User, Subject } from "../Data";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

class CourseSelect extends Page {

	constructor(props) {
		super(props);
		this.state = {
			groups: [],
			enrollments: [],
			enrollableGroups: [],
			subjects: [],
			style: {
				overflowY: "scroll",
			}
		}

	}

	componentWillMount() {
		Promise.all([Group.getList(), Subject.getList()]).then((data) => {
			this.setState({ groups: data[0], subjects: data[1] });
		});
	}

	getGroupsPerSubject(subject) {
		return this.state.groups.filter(group => {
			return (subject.id === group.subjectId);
		});
	}

	render() {
		var subjects = this.state.subjects.map((subject) => {
			return <SubjectComponent
				key={subject.id}
				subject={subject}
				extended={false}
				groups={this.getGroupsPerSubject.bind(this)(subject)}
			/>
		});
		return (
			<div className="Page" style={this.state.style}>
				{/* <AppBar position="static" color="default">
					<Typography variant="title" color="inherit">
						Q-Highschool
					</Typography>
				</AppBar> */}
				{subjects}
				<br/>
				<br/>
				<br/>
			</div>
		);
	}
}

export default CourseSelect;

