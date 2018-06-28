import React from 'react';
import Page from './Page';
import SubjectComponent from '../components/Subject';
import { Group, User, Subject } from "../Data";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

class CourseSelect extends Page {

	constructor(props) {
		super(props);
		this.state = {
			groups: [],
			enrollments: [],
			enrollableGroups: [],
			subjects: [],
			sortMethod: "subject",
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

	handleSortChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		let data;
		switch(this.state.sortMethod) {
			case "subject":
			data = this.state.subjects.map((subject) => {
				return <SubjectComponent
					key={subject.id}
					subject={subject}
					extended={false}
					groups={this.getGroupsPerSubject.bind(this)(subject)}
				/>
			});
			break;
			case "enrollable":
			break;
		}

		return (
			<div className="Page" style={this.state.style}>
				<AppBar position="static" color="default">
					<Toolbar>
						<Typography variant="subheading" color="textSecondary">
							Meld je aan voor modules
          	</Typography>
						<form autoComplete="off" style={{ right: 10, position: "absolute"}}>
							<FormControl>
								<InputLabel htmlFor="sortMethod">Sorteren op</InputLabel>
								<Select
									value={this.state.sortMethod}
									onChange={this.handleSortChange}
									inputProps={{
										name: 'sortMethod',
										id: 'sortMethod',
									}}
									autoWidth={true}
									size={"large"}
								>
									<MenuItem value="subject">
										<Typography variant="subheading" color="textSecondary" style={{width:"100px"}}>
											Vak
          					</Typography>
									</MenuItem>
									<MenuItem value={"enrollable"} style={{width:"100px"}}>Aanmeldbaar</MenuItem>
								</Select>
							</FormControl>
						</form>
					</Toolbar>
				</AppBar>
				<br />
				{data}
				<br />
				<br />
				<br />
			</div>
		);
	}
}

export default CourseSelect;

