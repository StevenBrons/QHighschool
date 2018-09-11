import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import { AppBar, Toolbar } from '@material-ui/core';
import Field from './Field';

class Lesson extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
			style: {
				width: "100%",
				height: "auto",
				marginTop: "10px",
				marginBottom: "10px",
				padding: "2px",
				display: "flex",
				alignItems: "start",
				position: "relative",
			},
		}
	}

	getWeekdayString(number) {
		return ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"][number];
	}

	handleChange = (event) => {
		this.props.handleChange({
			...this.props.lesson,
			[event.name]: event.target.value,
		});
	}


	render() {
		const lesson = this.props.lesson;
		if (lesson.id === -1) {
			return (
				<AppBar position="static" color="default">
					<Toolbar
						elevation={this.state.hover ? 4 : 2}
						onMouseEnter={() => this.setState({ hover: true })}
						onMouseLeave={() => this.setState({ hover: false })}
						style={{ ...this.state.style, ...{ margin: "0px" } }}
						variant="dense"
						disableGutters
					>
						<div style={{ flex: 1 }}>
							<Field style={{ fontWeight: "bold" }} value="Lesnummer" />
							<Field style={{ fontWeight: "bold" }} value="Soort les" />
						</div>
						<Field style={{ flex: 4, fontWeight: "bold" }} value="Onderwerp" />
						<Field style={{ flex: 8, fontWeight: "bold" }} value="Activiteiten" />
						<div style={{ flex: 2 }}>
							<Field style={{ fontWeight: "bold" }} value="Datum" />
							<Field style={{ fontWeight: "bold" }} value="Aanwezigheid" />
						</div>
					</Toolbar >
				</AppBar >
			);
		}
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<div style={{ flex: 1 }}>
					<Field margin="none" variant="body1" color="primary" style={{ fontWeight: "bold" }} value={"Les " + lesson.numberInBlock} />
					<Field margin="none" label="Soort les" name="kind" variant="body1" value={lesson.kind} editable={this.props.editable} onChange={this.handleChange} />
				</div>
				<Field margin="none" label="Onderwerp" area name="subject" variant="body1" style={{ flex: 4 }} value={lesson.subject} editable={this.props.editable} onChange={this.handleChange} />
				<Field margin="none" label="Activiteiten" area name="activities" variant="body1" style={{ flex: 8 }} value={lesson.activities} editable={this.props.editable} onChange={this.handleChange} />
				<div style={{ flex: 2 }}>
					<Field margin="none" variant="body1" value={this.getWeekdayString(new Date(lesson.date).getDay()) + " " + new Date(lesson.date).getDate() + "-" + (new Date(lesson.date).getMonth() + 1) + "-" + new Date(lesson.date).getFullYear()} />
					<Field margin="none" name="presence" label="Aanwezigheid" labelVisible variant="body1" value={lesson.presence} editable={this.props.editable} onChange={this.handleChange} options={[{label:"Noodzakelijk",value:"required"},{label:"Optioneel",value:"optional"},{label:"Geen bijeenkomst",value:"unrequired"}]}/>
				</div>
			</Paper >
		);
	}


}


export default Lesson;

