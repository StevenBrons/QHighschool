import React, { Component } from 'react';
import EnsureSecureLogin from '../components/EnsureSecureLogin';
import Page from './Page';
import Progress from '../components/Progress'
import map from 'lodash/map';

import { connect } from 'react-redux';
import SelectUser from '../components/SelectUser';
import { Divider, Toolbar, Button, Paper, Typography } from '@material-ui/core';
import Field from '../components/Field';
import { getSubjects, setAlias, addNotification, getGroups } from '../store/actions';

const initialValues = {
	subject: {
		name: "",
		description:"",
	},
	course: {
		name: "",
		subjectId: null,
	},
	group: {
		courseId: null, 
		teacherId: null, 
	}
}

class ControlPanel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			aliasId: null,
			subject: initialValues.subject,
			course: initialValues.course,
			group: initialValues.group,
		}
	}

	componentDidMount() {
		this.props.getGroups();
		this.props.getSubjects();
	}

	loginUsingAlias = () => {
		this.props.dispatch(setAlias(this.state.aliasId));
	}

	handleAliasChange = (userId) => {
		this.setState({
			aliasId: userId,
		});
	}

	notification = (typeObjectAdded, success) => {
		let typeNames = {"subject": "Vak", "course": "Module", "group": "Groep"};
		typeObjectAdded = typeNames[typeObjectAdded];
		if ( success ) {
			console.log(typeObjectAdded + " added!");
		}  else {
			console.log(typeObjectAdded + " not added :(");
		}
		// if ( success ) {
		// 	this.props.addNotification(
		// 		{
		// 			priority:"low",
		// 			type:"bar",
		// 			message:typeObjectAdded + "succesvol toegevoegd!",
		// 			scope: "beheer",
		// 		}
		// 	)
		// } else {
		// 	this.props.addNotification(
		// 		{
		// 			priority:"medium",
		// 			type:"bar",
		// 			message:"Er is iets misgegaan. " + typeObjectAdded + " is niet toegevoegd.",
		// 			scope:"beheer",
		// 		}
		// 	)
		// }
	}

	add(type) {
		const typeValues = this.state[type];
		let addFunction;
		switch (type) {
			case "subject": addFunction =  async () => {return this.props.addSubject(typeValues.name, typeValues.description).then(success => {return success.success})};
							break;
			case "course": addFunction = async () => {return this.props.addCourse(typeValues.name, typeValues.subjectId).then(success => {return success.success})};
							break;
			default: addFunction = async () => {return this.props.addGroup(typeValues.courseId, typeValues.teacherId).then(success => {return success.success})}; // group
		}
		addFunction().then(success => {
			if ( success ) {
				this.setState({
					[type]: initialValues[type],
				})
			}
			this.notification(type,success);
		})
	}

	handleChange = (event,type ) => {
		this.setState(prevState => ({
			[type]: {
				...prevState[type],
				[event.name]: event.target.value,
			}
		}))
	}

	render() {
		const subject = this.state.subject;
		const course = this.state.course;
		const group = this.state.group;
		const subjects = this.props.subjects;
		const courses = this.props.groups; // DIT MOET this.props.courses worden
		let subjectPicker, coursePicker;
		if ( subjects == null ) {
			subjectPicker = <Progress/>;
		} else {
			subjectPicker = <Field value={course.subjectId} name="subjectId" label="Vak" onChange={(event) => {this.handleChange(event, "course")}} editable={true} options={map(subjects, (subject) => { return { value: subject.id, label: subject.name } })} style={{minWidth:"200px"}} />
		}
		if ( courses == null ) {
			coursePicker = <Progress/>;
		} else { 
			coursePicker = <Field value={group.courseId} name="courseId" label="Module" onChange={(event) => {this.handleChange(event, "group")}} editable={true} options={map(courses, (course) => { return { value: course.courseId, label: course.courseName } })} style={{minWidth:"200px"}} />
		}
		return (
			<Page>
				<EnsureSecureLogin>
					<Paper
						elevation={2}
						style={{ position: "relative" }}
					>
						<Toolbar style={{ display: "flex" }}>
							<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
								Beheer
							</Typography>
						</Toolbar>
					</Paper>
					<div style={{margin:"10px 0"}}>
						<Button variant="contained" color="primary" disabled={this.state.aliasId == null} onClick={this.loginUsingAlias}>Login in met alias</Button>
					</div>
					<Divider/>
							<Typography variant="headline" color="primary" style={{margin:"12px"}}>
								Nieuw vak:
							</Typography>
							<div style={{display:"flex"}}>
								<Field name="name" label={"Naam"} value={subject.name} onChange={(event) => {this.handleChange(event, "subject")}} editable={true} validate={{maxLength:50}} />
								<Field name="description" label="Omschrijving" value={subject.description} onChange={(event) => {this.handleChange(event, "subject")}} editable={true} style={{flex:"5"}} validate={{maxLength:440}} />
								<Button variant="contained" color="primary" style={{height:"37px", margin:"12px"}} onClick={() => {this.add("subject")}}>
									Voeg toe	
								</Button>
							</div>
					<Divider/>
							<Typography variant="headline" color="primary" style={{margin:"12px"}}>
								Nieuwe module:
							</Typography>
							<div >
								<Field name="name" label={"Naam"} value={course.name} onChange={(event) => {this.handleChange(event, "course")}} editable={true} validate={{maxLength:50}} />
								{subjectPicker}
								<Button variant="contained" color="primary" style={{height:"37px", margin:"12px"}} onClick={() => {this.add("course")}}>
									Voeg toe	
								</Button>
							</div>
					<Divider/>
							<Typography variant="headline" color="primary" style={{margin:"12px"}}>
								Nieuwe groep:
							</Typography>
							<div >
								{coursePicker}
								<SelectUser name="teacher" value={group.teacherId} onChange={(userId) => {let event= {target: {value: userId}, name:"teacherId"}; this.handleChange(event, "group")}} />
								{/* for the SelectUsers's onChange we fake an 'event' because SelectUser is special */}
								<Button variant="contained" color="primary" style={{height:"37px", margin:"12px"}} onClick={() => {this.add("group")}}>
									Voeg toe	
								</Button>
							</div>
				</EnsureSecureLogin>
			</Page>
		);
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
		addSubject: async (name, description) => { console.log("ADD SUBJECT with name: " + name + ", and description: "+ description); return { success: true} },
		addCourse: async (name, subjectId) => { console.log("ADD COURSE with name: "+ name + ", and subjectId: " + subjectId); return { success: true } },
		addGroup: async (courseId, userId) => { console.log("ADD GROUP with courseId: " + courseId + ", and userId: "+ userId); return { success: true } },
		getSubjects: () => dispatch(getSubjects()),
		getGroups: () => dispatch(getGroups()),
		addNotification: (notification) => dispatch(addNotification(notification)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);