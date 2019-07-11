import React, { Component } from "react";
import Page from "./Page";
import { Typography, Toolbar, Paper, Divider} from '@material-ui/core';
import Field from "../components/Field";
import CheckIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

const courses = [
	"module1","module2","module3","module4","module5","module6",
]

const PTA = {
	T01: ["module1","module2","module3"],
	T02: ["module3","module4","module5"],
	T03: ["module5","module6"],
}

class Track extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: {
				T01: null,
				T02: null,
				T03: null,
			},
			freeCourses: [...courses],
			accepted: false,
		}
	}

	moveToField = (field,value) => {
		let fields = this.state.fields;
		let freeCourses = this.state.freeCourses;
		for (let _field in fields ) {
			if ( _field !== field && fields[_field] === value ) { // if course originated from field, clear that field
				fields[_field] = null;
			}
		}
		let index = freeCourses.indexOf(value);
		if ( index !== -1 ){ // if course is in freeCourses, remove it from there
			freeCourses.splice(index,1);
		}
		if ( fields[field] != null ) { // if it already contains a course
			freeCourses.push(fields[field]);
			freeCourses.sort();
		}
		fields[field] = value;

		this.setState({
			fields:fields,
			freeCourses: freeCourses,
		})
	}

	moveToFree = (course) => {
		let fields = this.state.fields;
		for (let field in fields) {
			if (fields[field] === course ) {
				fields[field] = null;
				break;
			} 
		}
		this.setState({
			fields: fields,
			freeCourses: [...this.state.freeCourses, course].sort(),
		})
	}

	trackAccepted = () => {
		const fields = this.state.fields;
		for (let field in fields) {
			if (!( this.courseAcceptedByPTA(fields[field], field) && this.courseAcceptedByPTA(fields[field], field)) || fields[field] == null) {
				return false;
			}
		}
		return true;
	}

	courseAcceptedByPTA = (course,field) => {
		return ( PTA[field].includes(course))
	}

	courseNotDouble = (course,field) => {
		return (Object.keys(this.state.fields).reduce((acc, value) => {return acc && ( value === field || this.state.fields[value] !== course )}, true));
		// test if this course is not in another field
	}

	colorOption = (course,field) => {
		return this.courseAcceptedByPTA(course,field) ? this.courseNotDouble(course,field)? "" : "orange" : "red";
	}

	render() {
		return (
			<Page>
				<Paper elevation={2} style={{ position: "relative" }}>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Parcours
						</Typography>
					</Toolbar>
				</Paper>
				<div>
					{Object.keys(PTA).map((field) => 
						<Field key={field} 
								label={field} 
								value={this.state.fields[field]} 
								options={courses.map(course => {
									return {label: course, value: course, style:{backgroundColor:this.colorOption(course,field)}};
								})}
								editable 
								onChange={value=> this.moveToField(field,value)}/>
					)}
					{
						this.trackAccepted() ? <CheckIcon style={{margin:"20px", color:"green"}}/> : <ErrorIcon style={{margin:"20px", color:"orange"}}/>
					}
				</div>

				<Divider />
				<div style={{display:"flex"}}>
					{Object.keys(PTA).map((field) =>
						<div onDragOver={this.onDragOver} 
							onDrop={e => this.onDrop(e, field)}
							key={field} 
							style={{height:"300px", width:"220px", margin:"10px", borderRadius:"10px", border:"1px dashed "+ this.colorOption(this.state.fields[field],field)}}>
								<h1>{field}</h1>
								{
									this.state.fields[field] &&
									<MovableCourse course={this.state.fields[field]}/>
								}
							</div>
					)}
					{
						this.trackAccepted() ? <CheckIcon style={{margin:"20px", color:"green"}}/> : <ErrorIcon style={{margin:"20px", color:"orange"}}/>
					}
				</div>
				<Divider />
				<div style={{display:"flex"}}
					onDragOver={this.onDragOver}
					onDrop={e => this.onDrop(e,"free")}>
				{
					this.state.freeCourses.map((course => { return (<MovableCourse key={course} course={course}/>);})) }
				</div>
			</Page>
		)
	}

	onDragOver = event => {
		event.preventDefault();
	}

	onDrop = (event,field) => {
		let course = event.dataTransfer.getData("text");
		if (field === "free") {
			this.moveToFree(course);
		} else {
			this.moveToField(field,course);
		}
	}
}

class MovableCourse extends Component {

	onDragStart = (event,course) => {
		event.dataTransfer.setData("text/plain", course);
	}
	
	render() {
		let course = this.props.course;
		return (
			<Paper 
				draggable onDragStart={e => this.onDragStart(e,course)} 
				elevation={3} 
				style={{height:"200px", width:"200px", margin:"10px", cursor: "move"}}>
				<h2 style={{margin:"10px"}}>
					{course}
				</h2>
			</Paper>
		);
	}
}

export default Track;