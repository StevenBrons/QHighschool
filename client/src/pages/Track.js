import React, { Component } from "react";
import Page from "./Page";
import { Typography, Toolbar, Paper, Button, withStyles, Tabs, Tab, Badge } from '@material-ui/core';
import Progress from '../components/Progress';
import CheckIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { connect } from 'react-redux';
import { getGroups} from '../store/actions';
import Field from "../components/Field";

const Orange = "#f68620"; // should be taken from theme
const Red = "#c4122f";

const PTAInformatica = {
	"PO1": [40],
	"PO2": [44],
	"PO3": [45,47],
	"PO4": [49],
	"PO5": [51,52,53,54],
	"PO6": [56],
	"PO7": [51,52,53,54],
}

class Track extends Component {
	constructor(props) {
		super(props);
		// const years = Object.keys(props.courseSchedule).map(y => parseInt(y,10)); TODO: dependant on student years
		const years = [4,5,6];
		let coursesSelected = {};
		years.forEach(y => coursesSelected[y] = {1:[],2:[],3:[],4:[],})
		this.state = {
			coursesSelected: coursesSelected,
			subject: "",
			year: years.includes(props.year) ? props.year : years[0],
		}
	}

	componentDidMount() {
		this.props.getGroups();
	}

	trackAccepted = () => {
		return false;
	}

	onChange = (year,period,course) => {
		let coursesSelected = this.state.coursesSelected;
		if (coursesSelected[year][period].includes(course)) {
			coursesSelected[year][period].splice(coursesSelected[year][period].indexOf(course), 1);
		} else {
			coursesSelected[year][period].push(course);
		}
		this.setState({
			coursesSelected: coursesSelected,
		})
	}

	changeYear = (e,value) => {
		this.setState({
			year:value,
		})
	}

	changeSubject = subject => {
		this.setState({
			subject:subject,
		})
	}

	render() {
		const { year, coursesSelected } = this.state;
		let subject = this.state.subject;

		const subjects = this.props.subjects;
		if ( subjects.length === 0 ) {
			return (
				<Page>
					<Progress />
				</Page>
			)
		}

		subject = !subject ? subjects[0] : subject;
		const coursesPerPeriod = this.props.courseSchedule[subject][year];
		return (
			<Page>
				<Paper elevation={2} style={{ position: "relative" }}>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Parcours
						</Typography>
						{
							this.trackAccepted() ? <CheckIcon style={{ margin: "20px", color: "green" }} /> : <ErrorIcon style={{ margin: "20px", color: "orange" }} />
						}
						<Field
							label="Vak"
							value={subject}
							editable
							options={subjects}
							onChange={this.changeSubject}
						/>
					</Toolbar>
				</Paper>

				<div style={{textAlign:"center"}}>
					<Paper
						style={{display:"inline-block", marginTop:"20px", marginBottom:"15px"}}
						>
						<Tabs
							value={year}
							indicatorColor="primary"
							centered
							onChange={this.changeYear}
							>
							<Tab value={4}  label="Klas 4"/>
							<Tab value={5} label="Klas 5"/>
							<Tab value={6} label="Klas 6"/>
						</Tabs>
					</Paper>
				</div>
					<div style={{height:"30px", background:Red }}>
						<Typography variant="h3" style={{color:"white", margin:"5px", padding:"4px"}}>Klas {year}</Typography>
					</div>
					<div style={{ // triangle
						height:"70px",
						backgroundImage: "linear-gradient(to right bottom, " + Red + " 0%, " + Red + " 50%, transparent 51%)" }} // 51% to avoid pixelated edge
					/>

				<div>
					{[1,2,3,4].map(p => {
						return (
						<div
							key={p}
							style = {{ borderLeft: "solid 6pt " + Red }}
						>
							<div>
								<Typography 
									variant="h6"
									style={{background:Red, color:"white", display:"inline-block", paddingRight:"5px"}}
								>
									Blok {p}
								</Typography>
							</div>
							{coursesPerPeriod[p].map(course => {
								const id = course.courseId;
								return (
									<span key={id} style={{display:"inline-block", margin:"15px"}}>
										<CourseButton 
											selected={coursesSelected[year][p].includes(id)}
											evaluation={false}
											disabled={false}
											courseName={course.courseName}
											onChange={_ => this.onChange(year,p,id)}
											badgeLabel={course.necessity === "free" ? "Vrij" : course.necessity === "choice" ? "Keuze" : "Verplicht" }// EN => NL
										/>
									</span> //selected, evaluation, disabled, courseName, onChange, badgeLabel
								);
							})}
						</div>
						);
					})}
				</div>
			</Page>
		)
	}
}

const buttonStyles = {
	root: {
		color: "white",
		borderRadius: "0",
		background: Orange,
		width:"200px",
		height:"80px",
		"&:hover":{
			border: "10px solid " + Orange,
			background: Red,
		},
		"&:disabled": {
			background: "grey",
		}
	},
	textSecondary: {
		background: Red,
		"&:hover":{
			border: "10px solid " + Red,
			background: Orange,
		}
	}
}

const StyledButton = withStyles(buttonStyles)(Button);

const EvaluationCourseStyle = {
	root: {
		background: Red,
		display: "block",
		color: "white",
		height:"120px",
	}
}

const EvaluationCourse = withStyles(EvaluationCourseStyle)(StyledButton);

class CourseButton extends Component {

	render() {
		const {selected, evaluation, disabled, courseName, onChange, badgeLabel} = this.props;
		if ( evaluation ) {
			return (
				<EvaluationCourse disabled>
					{courseName}
					{
					<h1 style={{margin:"0"}}> {evaluation} </h1>
					}
				</EvaluationCourse>
			)
		}
		return (
			<Badge color="secondary" badgeContent={badgeLabel} invisible={disabled}>
				<StyledButton 
					onClick ={onChange}
					color={selected ? "secondary" : "primary" }
					disabled={disabled}
				>
					{courseName}
				</StyledButton>
			</Badge>
		)
	}
}

function enrollableYears(enrollableFor, level) { // ("VWO 4, HAVO 4, HAVO 5", "HAVO") => [4,5]
	if ( !enrollableFor ) 
		return level === "VWO" ? [4,5,6] : [4,5];
	let years = enrollableFor.match(new RegExp(level + " \\d", "gi"));
	if ( years )
		return years.map(y => y.match(/\d/g)[0]);
	return [];
}

function necessityForPTA(courseId, PTA) { // "free" || "choice" || "necessary"
	for ( let test in PTA ) {
		if ( PTA[test].includes(courseId) ) {
			if (PTA[test].length === 1 )
				return "necessary";
			return "choice";
		}
	}
	return "free";
}

function mapStateToProps(state) {
	const user = state.users[state.userId];
	const groups = state.groups;

	const years = [4,5,6];// TODO: let years be dependant on user

	let courseSchedule = {};
	let subjects = [];
	if ( groups ) {
		Object.keys(groups).forEach(groupId => {// put groups in their place in the timeline
			let group = groups[groupId];
			group.necessity = necessityForPTA(group.courseId, PTAInformatica);
			enrollableYears(group.enrollableFor, user.level).forEach(y => {
				if ( !courseSchedule[group.subjectName] ) { // initialize schedule for subject
					courseSchedule[group.subjectName] = {};
					years.forEach(y => courseSchedule[group.subjectName][y] = {1:[],2:[],3:[],4:[]});
					subjects.push(group.subjectName);
				}
				courseSchedule[group.subjectName][y][group.period].push(group);
			}) 
		})
	}
	return {
		year: user.year,
		courseSchedule: courseSchedule,
		subjects: subjects,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getGroups: () => dispatch(getGroups()),
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(Track);