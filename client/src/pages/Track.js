import React, { Component } from "react";
import Page from "./Page";
import { Typography, Toolbar, Paper, Divider } from '@material-ui/core';
import Field from "../components/Field";
import CheckIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

const courseNames = [
	"module1", "module2", "module3", "module4", "module5", "module6",
]

const PTA = {
	T01: ["module1", "module2", "module3"],
	T02: ["module3", "module4", "module5"],
	T03: ["module5", "module6"],
}

class Track extends Component {
	constructor(props) {
		super(props);
		let courses = {};
		courseNames.map(course => courses[course] = {
			field: "free",
			possibleFields: Object.keys(PTA).filter(field => PTA[field].includes(course)), // find what fields this course can go into according to PTA
		});
		let fields = {};
		Object.keys(PTA).forEach(field => fields[field] = null);
		this.state = {
			fields: fields,
			courses: courses,
			accepted: false,
			highlighted: null,
		}
	}

	moveToField = (field, course) => {
		let courses = this.state.courses;
		let courseCurrentlyInField = this.state.fields[field];
		if (courseCurrentlyInField !== null) {
			this.moveToFree(courseCurrentlyInField);
		}
		courses[course].field = field;
		this.setState({
			courses: courses,
			fields: this.fields(courses),
		})
	}

	moveToFree = (course) => {
		let courses = this.state.courses;
		courses[course].field = "free";
		this.setState({
			courses: courses,
			fields: this.fields(courses),
		})
	}

	fields = (courses) => {
		let fields = {};
		Object.keys(PTA).forEach(field => {
			let course = Object.keys(courses).find(c => courses[c].field === field);
			fields[field] = course ? course : null;
		});
		return fields
	}

	trackAccepted = () => {
		let fields = this.state.fields;
		for (let field in fields) {
			if (!(this.courseAcceptedByPTA(fields[field], field) && this.courseAcceptedByPTA(fields[field], field)) || fields[field] == null) {
				return false;
			}
		}
		return true;
	}

	courseAcceptedByPTA = (course, field) => {
		return (PTA[field].includes(course))
	}

	courseNotDouble = (course, field) => {
		return (Object.keys(this.state.fields).reduce((acc, value) => { return acc && (value === field || this.state.fields[value] !== course) }, true));
		// test if this course is not in another field
	}

	colorField = (course, field) => {
		const courses = this.state.courses;
		const highlighted = this.state.highlighted;
		if (highlighted === field || (courses[highlighted] && courses[highlighted].possibleFields.includes(field))) {
			// if field is highlighted OR a course is highlighted that fits in this field
			return "blue";
		}
		return this.courseAcceptedByPTA(course, field) ? this.courseNotDouble(course, field) ? "" : "orange" : "red";
	}

	colorCourse = course => {
		const highlighted = this.state.highlighted;
		if (highlighted === course || (PTA[highlighted] && PTA[highlighted].includes(course))) {
			// if course is highlighted OR a field is highlighted that this course can go in to
			return "blue";
		}
		return "";
	}

	render() {
		const courses = this.state.courses;
		const fields = this.state.fields;
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
					{Object.keys(fields).map((field) =>
						<Field key={field}
							label={field}
							value={fields[field]}
							options={Object.keys(courses).map(course => {
								return { label: course, value: course, style: { backgroundColor: this.colorField(course, field) } };
							})}
							editable
							onChange={value => this.moveToField(field, value)} />
					)}
					{
						this.trackAccepted() ? <CheckIcon style={{ margin: "20px", color: "green" }} /> : <ErrorIcon style={{ margin: "20px", color: "orange" }} />
					}
				</div>

				<Divider />
				<div style={{ display: "flex" }}>
					{Object.keys(fields).map((field) =>
						<div onDragOver={this.onDragOver}
							onDrop={e => this.onDrop(e, field)}
							onMouseEnter={e => this.mouseEnter(e, field)}
							onMouseLeave={e => this.mouseLeave(e, field)}
							key={field}
							style={{ height: "300px", width: "220px", margin: "10px", borderRadius: "10px", border: "1px dashed " + this.colorField(fields[field], field) }}>
							<h1>{field}</h1>
							{
								fields[field] &&
								this.movableCourse(fields[field])
							}
						</div>
					)}
					{
						this.trackAccepted() ? <CheckIcon style={{ margin: "20px", color: "green" }} /> : <ErrorIcon style={{ margin: "20px", color: "orange" }} />
					}
				</div>
				<Divider />
				<div style={{ display: "flex" }}
					onDragOver={this.onDragOver}
					onDrop={e => this.onDrop(e, "free")}>
					{
						Object.keys(courses).filter(c => courses[c].field === "free").map((course => { return (this.movableCourse(course)); }))}
				</div>
			</Page>
		)
	}

	mouseEnter = (event, object) => {
		this.setState({
			highlighted: object,
		})
	}

	mouseLeave = (event, object) => {
		this.setState({
			highlighted: null,
		})
	}

	onDragOver = event => {
		event.preventDefault();
	}

	onDrop = (event, field) => {
		let course = event.dataTransfer.getData("text");
		if (field === "free") {
			this.moveToFree(course);
		} else {
			this.moveToField(field, course);
		}
	}

	onDragStart = (event, course) => {
		event.dataTransfer.setData("text/plain", course);
	}

	movableCourse = (course) => {
		return (
			<Paper
				key={course}
				draggable onDragStart={e => this.onDragStart(e, course)}
				elevation={3}
				style={{ height: "200px", width: "200px", margin: "10px", cursor: "move" }}
				onMouseEnter={e => this.mouseEnter(e, course)}
				onMouseLeave={e => this.mouseLeave(e, course)}>
				<h2 style={{ margin: "10px", color: this.colorCourse(course) }}>
					{course}
				</h2>
			</Paper>
		);
	}
}

export default Track;