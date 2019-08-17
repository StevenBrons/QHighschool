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

// const PTA = {
// 	"PO1": [1],
// 	"PO2": [3],
// 	"PO3": [4,5],
// 	"PO4": [6],
// 	"PO5": [8,9,10,11],
// 	"PO6": [12],
// 	"PO7": [8,9,10,11],
// }

class Track extends Component {
	constructor(props) {
		super(props);
		// const years = Object.keys(props.courseSchedule).map(y => parseInt(y,10)); TODO: dependant on student years
		const years = [4,5,6];
		this.state = {
			coursesSelected: {
				1:null,
				2:null,
				3:null,
				4:null,
			},
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

	onChange = (period,course) => {
		let coursesSelected = this.state.coursesSelected;
		if (coursesSelected[period] === course ) {
			coursesSelected[period] = null;
		} else {
			coursesSelected[period] = course;
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
										{
										id!==2 ? // TODO replace with if has evaluation
											<Badge color="secondary" badgeContent={id < 8 ? id < 3 ? "Verplicht" : "Keuze" : "Vrij"}>
												<CourseButton 
													onClick ={_ => this.onChange(p,id)}
													color={coursesSelected[p] === id ? "secondary" : "primary" }
												>
													{course.courseName}
												</CourseButton>
											</Badge>
										:
											<CourseButton disabled >
												{course.courseName}
												{
												<h1 style={{margin:"0"}}> 9 </h1>
												}
											</CourseButton>
										}
									</span>
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
			background: Red,
			display: "block",
			color: "white",
			height:"120px",
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

const CourseButton = withStyles(buttonStyles)(Button);

function enrollableYears(enrollableFor, level) { // ("VWO 4, HAVO 4, HAVO 5", "HAVO") => [4,5]
	if ( !enrollableFor ) 
		return level === "VWO" ? [4,5,6] : [4,5];
	let years = enrollableFor.match(new RegExp(level + " \\d", "gi"));
	if ( years )
		return years.map(y => y.match(/\d/g)[0]);
	return [];
}

function mapStateToProps(state) {
	const user = state.users[state.userId];
	const groups = state.groups;

	const years = [4,5,6];// TODO: let years be dependant on user

	let courseSchedule = {};
	let subjects = [];
	if ( groups ) {
		Object.keys(groups).forEach(groupId => {
			const group = groups[groupId];
			enrollableYears(group.enrollableFor, user.level).forEach(y => {
				if ( !courseSchedule[group.subjectName] ) { // initialize schedule for subject
					courseSchedule[group.subjectName] = {};
					years.forEach(y => courseSchedule[group.subjectName][y] = {1:[],2:[],3:[],4:[]});
					subjects.push(group.subjectName);
				}
				courseSchedule[group.subjectName][y][group.period].push(groups[groupId]);
			}) // put groups in their place in the timeline
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