import React, { Component } from 'react';
import EnsureSecureLogin from '../components/EnsureSecureLogin';
import Page from './Page';
import $ from "jquery";
import map from 'lodash/map';

import { connect } from 'react-redux';
import queryString from "query-string";
import SelectUser from '../components/SelectUser';
import { Toolbar, Button, Paper, Typography, List, ListItem, ListItemText, } from '@material-ui/core';
import Field from '../components/Field';
import { getSubjects, setAlias, addNotification, addSubject, addCourse, addGroup, relogSecure } from '../store/actions';

const pages = ["alias", "vak", "module", "groep"];

class ControlPanel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			courses: [],
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		return {
			...prevState,
			...{
				page: values.page ? values.page : pages[0],
			}
		}
	}

	mapPageToListItem = (pageName) => {
		return <ListItem button onClick={() => this.handlePageChange(pageName)} key={pageName}>
			<ListItemText>
				<Typography variant="title" color={pageName === this.state.page ? "primary" : "default"} style={{ minWidth: "150px" }}>
					{pageName.charAt(0).toUpperCase() + pageName.slice(1)}
				</Typography>
			</ListItemText>
		</ListItem >
	}

	componentDidMount() {
		$.ajax({
			url: "api/course/list",
			type: "get",
			data: {},
			dataType: "json",
		}).then((courses) => {
			this.setState({
				courses
			});
		});
		this.props.getSubjects();
	}


	handlePageChange = value => {
		this.props.history.push({
			search: "page=" + value,
		});
	}

	getContent = () => {
		switch (this.state.page) {
			case "alias":
				return <Alias dispatch={this.props.dispatch} />
			case "vak":
				return <Subject addSubject={this.props.addSubject} />
			case "module":
				return <Course addCourse={this.props.addCourse} subjects={this.props.subjects} />
			case "groep":
				return <Group addGroup={this.props.addGroup} courses={this.state.courses} />
			default:
		}
	}

	render() {
		return (
			<Page>
				<EnsureSecureLogin>
					<Paper
						elevation={2}
						style={{ position: "relative" }}
					>
						<Toolbar style={{ display: "flex" }}>
							<Typography variant="subtitle1" color="textSecondary" style={{ flex: "2 1 auto" }}>
								Beheer
						</Typography>
						</Toolbar>
					</Paper>
					<div style={{ display: "flex" }} className="ColumnFlexDirectionOnMobile">
						<Paper elevation={2}>
							<List component="nav" style={{ flex: 1 }}>
								{pages.map(this.mapPageToListItem)}
							</List>
						</Paper>
						<div style={{ padding: "12px", width: "100%" }}>
							{this.getContent()}
						</div>
					</div>
				</EnsureSecureLogin>
			</Page>
		);
	}
}

class Alias extends Component {
	constructor(props) {
		super(props);
		this.state = {
			aliasId: null,
		}
	}

	;

	render() {
		return <div style={{ margin: "10px 0" }}>
			<SelectUser onChange={(aliasId) => this.setState({ aliasId })} />
			<br />
			<Button
				variant="contained"
				color="primary"
				disabled={this.state.aliasId == null}
				onClick={() => this.props.dispatch(setAlias(this.state.aliasId))}>
				Login in met alias
			</Button>
		</div>
	}
}

class Subject extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			description: "",
		}
	}
	render() {
		const subject = this.state;
		return <div>
			<Field
				label="Naam"
				value={subject.name}
				onChange={(name) => this.setState({ name })}
				editable={true}
				validate={{ maxLength: 50 }}
			/>
			<br />
			<Field
				label="Omschrijving"
				value={subject.description}
				onChange={(description) => this.setState({ description })}
				editable={true}
				validate={{ maxLength: 440 }}
				layout={{ area: true }}
			/>
			<Button
				variant="contained"
				color="primary"
				style={{ height: "37px", margin: "12px" }}
				onClick={() => { this.props.addSubject(subject.name, subject.description).then(relogSecure) }}>
				Voeg toe
			</Button>
		</div>
	}
}

class Course extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			subjectId: "",
		}
	}
	render() {
		const course = this.state;
		return <div>
			<Field
				label="Naam"
				value={course.name}
				onChange={(name) => this.setState({ name })}
				editable={true}
				validate={{ maxLength: 50 }}
				style={{ flex: "1" }}
			/>
			<br />
			<Field
				value={course.subjectId}
				subjectId label="Vak"
				onChange={(subjectId) => this.setState({ subjectId })}
				editable={true}
				options={map(this.props.subjects, (subject) => { return { value: subject.id, label: subject.name } })}
				style={{ minWidth: "200px" }}
			/>
			<br />
			<Button
				variant="contained"
				color="primary"
				style={{ height: "37px", margin: "12px" }}
				onClick={() => { this.props.addCourse(course.name, course.subjectId).then(relogSecure) }}>
				Voeg toe
			</Button>
		</div>
	}
}


class Group extends Component {
	constructor(props) {
		super(props);
		this.state = {
			courseId: null,
			teacherId: null,
		}
	}
	render() {
		const group = this.state;
		return <div>
			<Field
				value={group.courseId}
				label="Module"
				onChange={(courseId) => this.setState({ courseId })}
				editable={true}
				options={this.props.courses.map((course) => { return { label: course.name, value: course.id } })}
				style={{ minWidth: "200px" }}
			/>
			<br />
			<SelectUser
				value={group.teacherId}
				onChange={(teacherId) => this.setState({ teacherId })}
			/>
			<br />
			<Button
				variant="contained"
				color="primary"
				style={{ height: "37px", margin: "12px" }}
				onClick={() => { this.props.addGroup(group.courseId, group.teacherId).then(relogSecure) }}>
				Voeg toe
			</Button>
		</div>
	}
}

function mapStateToProps(state) {
	return {
		subjects: state.subjects,
		groups: state.groups,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		addSubject: async (name, description) => dispatch(addSubject(name, description)),
		addCourse: async (name, subjectId) => dispatch(addCourse(name, subjectId)),
		addGroup: async (courseId, userId) => dispatch(addGroup(courseId, userId)),
		addNotification: (notification) => dispatch(addNotification(notification)),
		getSubjects: () => dispatch(getSubjects()),
		dispatch: dispatch,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);