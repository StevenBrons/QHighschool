import React, { Component } from 'react';
import EnsureSecureLogin from '../components/EnsureSecureLogin';
import Page from './Page';
import $ from "jquery";
import map from 'lodash/map';

import { connect } from 'react-redux';
import queryString from "query-string";
import UserField from '../fields/UserField';
import Field from "../components/Field"
import { Toolbar, Button, Paper, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import { getSubjects, setAlias, addNotification, addSubject, addCourse, addGroup, relogSecure } from '../store/actions';
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';

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
				<Typography variant="button" color={pageName === this.state.page ? "primary" : "initial"} style={{ minWidth: "150px" }}>
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
						<div style={{ padding: "12px", width: "50%" }}>
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

	render() {
		return <div style={{ margin: "10px 0" }}>
			<UserField value={this.state.aliasId} onChange={(aliasId) => this.setState({ aliasId })} />
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
			<InputField
				label="Naam"
				value={subject.name}
				onChange={(name) => this.setState({ name })}
				editable
				validate={{ maxLength: 50 }}
			/>
			<br />
			<InputField
				label="Omschrijving"
				value={subject.description}
				onChange={(description) => this.setState({ description })}
				editable
				validate={{ maxLength: 440 }}
				multiline
			/>
			<Button
				variant="contained"
				color="primary"
				style={{ height: "37px", margin: "12px" }}
				onClick={() => { this.props.addSubject(subject.name, subject.description).then(relogSecure) }}
			>
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
			<InputField
				label="Naam"
				value={course.name}
				onChange={(name) => this.setState({ name })}
				editable
				validate={{ maxLength: 50 }}
			/>
			<br />
			<SelectField
				value={course.subjectId}
				label="Vak"
				onChange={(subjectId) => this.setState({ subjectId })}
				editable
				options={
					map(this.props.subjects, (subject) => { return { value: subject.id, label: subject.name } })
				}
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
			<SelectField
				value={group.courseId}
				label="Module"
				onChange={(courseId) => this.setState({ courseId })}
				editable
				search
				options={this.props.courses.map((course) => { return { label: course.name, value: course.id } })}
				style={{ minWidth: "200px" }}
			/>
			<br />
			<UserField
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