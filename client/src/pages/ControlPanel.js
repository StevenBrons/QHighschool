import React, { Component } from 'react';
import EnsureSecureLogin from '../components/EnsureSecureLogin';
import Page from './Page';
import Progress from '../components/Progress'
import map from 'lodash/map';

import { connect } from 'react-redux';
import SelectUser from '../components/SelectUser';
import { Divider, Toolbar, Button, Paper, Typography } from '@material-ui/core';
import Field from '../components/Field';
import { getSubjects, setAlias} from '../store/actions';

class ControlPanel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			aliasId: null,
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
	}

	componentDidMount() {
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

	addSubject = () => {
		const subject = this.state.subject;
		this.props.addSubject(subject.name,subject.description);
		// handle succes/ no succes
		// clear fields
	}

	addCourse = () => {
		const course = this.state.course;
		this.props.addCourse(course.name, course.subjectId);
		// handle succes/ no succes
		// clear fields
	}

	addGroup = () => {
		const group = this.state.course;
		this.props.addGroup(group.courseId, group.teacherId);
		// handle succes/ no succes
		// clear fields
	}


	handleSubjectChange = (event) => {
		this.setState(prevState => ({
			subject: {
				...prevState.subject,
				[event.name]: event.target.value,
			}
		}));
	}
	
	handleCourseChange = (event) => {
		this.setState(prevState => ({
			course: {
				...prevState.course,
				[event.name]: event.target.value,
			}
		}))

	}

	handleGroupTeacherChange = (userId, displayName) => {
		this.setState(prevState => ({
			fieldValues: {
				...prevState.fieldValues, groupTeacher:displayName, }
		}));
	}

	handleGroupCourseChange = (event) => {

	}

	render() {
		const subject = this.state.subject;
		const course = this.state.course;
		const group = this.state.group;
		const subjects = this.props.subjects;
		let subjectPicker;
		if ( subjects == null ) {
			subjectPicker = <Progress/>;
		} else {
			subjectPicker = <Field value={course.subjectId} name="subjectId" label="Vak" onChange={this.handleCourseChange} editable={true} options={map(subjects, (subject) => { return { value: subject.id, label: subject.name } })} style={{minWidth:"200px"}} />
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
								<Field name="name" label={"Naam"} value={subject.name} onChange={this.handleSubjectChange} editable={true} validate={{maxLength:50}} />
								<Field name="description" label="Omschrijving" value={subject.description} onChange={this.handleSubjectChange} editable={true} style={{flex:"5"}} validate={{maxLength:440}} />
								<Button variant="contained" color="primary" style={{height:"37px", margin:"12px"}} onClick={this.addSubject}>
									Voeg toe	
								</Button>
							</div>
					<Divider/>
							<Typography variant="headline" color="primary" style={{margin:"12px"}}>
								Nieuwe module:
							</Typography>
							<div >
								<Field name="name" label={"Naam"} value={course.name} onChange={this.handleCourseChange} editable={true} validate={{maxLength:50}} />
								{subjectPicker}
								<Button variant="contained" color="primary" style={{height:"37px", margin:"12px"}} onClick={this.addCourse}>
									Voeg toe	
								</Button>
							</div>
					<Divider/>
							<Typography variant="headline" color="primary" style={{margin:"12px"}}>
								Nieuwe groep:
							</Typography>
							<div >
								<Field name="module" label={"Module"} value={group.handleGroupCourseChange} options={["Webdesign", "Wat is leven?", "Cryptografie"]} onChange={this.hanleChange} editable={true} style={{minWidth:"250px"}} />
								<SelectUser name="teacher" value={group.handleGroupTeacherChange} onChange={this.handleTeacherChange} />
								<Button variant="contained" color="primary" style={{height:"37px", margin:"12px"}} onClick={this.addGroup}>
									Voeg toe	
								</Button>
							</div>
				</EnsureSecureLogin>
			</Page>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		subjects: state.subjects,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		addSubject: async (name, description) => { console.log("ADD SUBJECT"); return { sucess: true } },
		addCourse: async (name, subjectId) => { console.log("ADD COURSE"); return { sucess: true } },
		addGroup: async (courseId, userId) => { console.log("ADD GROUP"); return { sucess: true } },
		getSubjects: () => dispatch(getSubjects()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);


