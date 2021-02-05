import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { setPresenceUserStatus } from "../../store/actions";
import { connect } from "react-redux";
import InputField from '../../fields/InputField';
import SelectField from '../../fields/SelectField';
import "./Lesson.css";

class Lesson extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
		}
	}

	getWeekdayString(number) {
		return ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"][number];
	}

	handleChange = (name, value) => {
		console.log(name);
		console.log(value);
		this.props.handleChange({
			...this.props.lesson,
			[name]: value,
		});
	}

	render() {
		const lesson = this.props.lesson;
		let displayDate = "niet van toepassing";
		if (lesson.date) {
			const d = new Date(lesson.date);
			displayDate = `${this.getWeekdayString(d.getDay())} ${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
		}
		return <Paper
			elevation={this.state.hover ? 2 : 1}
			onMouseEnter={() => this.setState({ hover: true })}
			onMouseLeave={() => this.setState({ hover: false })}
			component="tr"
			className="Lesson"
		>
			<td>
				<div>
					<Typography color="primary" variant="button" component="td" >
						{"Les " + lesson.numberInBlock}
					</Typography>
					<Typography component="td" variant="body1" color="textSecondary">
						{displayDate}
					</Typography>
				</div>
				<div className="LocationRoom">
					<InputField
						label="Locatie"
						value={lesson.location}
						editable={this.props.editable}
						onChange={(value) => this.handleChange("location", value)}
					/>
					<InputField
						label="Lokaal"
						value={lesson.room}
						editable={this.props.editable}
						onChange={(value) => this.handleChange("room", value)}
					/>
				</div>
			</td>
			<InputField
				label="Onderwerp"
				value={lesson.subject}
				editable={this.props.editable}
				multiline
				onChange={(value) => this.handleChange("subject", value)}
				td
			/>
			<InputField
				label="Activiteiten"
				value={lesson.activities}
				editable={this.props.editable}
				multiline
				onChange={(value) => this.handleChange("activities", value)}
				td
			/>
			<td style={{ display: "flex", flexDirection: "column", verticleAlign: "top" }}>
				<SelectField
					label="Soort les"
					value={lesson.kind}
					editable={this.props.editable}
					options={[
						{ value: "fysiek", label: "Fysiek", category: "Centrale bijeenkomst" },
						{ value: "online", label: "Online", category: "Centrale bijeenkomst" },
						{ value: "hybride", label: "Hybride", category: "Centrale bijeenkomst" },
						{ value: "groepswerk", label: "Groepswerk", category: "Geen centrale bijeenkomst" },
						{ value: "zelfstudie", label: "Zelfstudie", category: "Geen centrale bijeenkomst" },
					]}
					onChange={(value) => this.handleChange("kind", value)}
				>
				</SelectField>
				<SelectField
					label="Aanwezigheid"
					value={lesson.presence}
					editable={this.props.editable}
					onChange={(value) => this.handleChange("presence", value)}
					options={[{ label: "Noodzakelijk", value: "required" }, { label: "Eigen keuze", value: "optional" }]}
				/>
			</td>
		</Paper >;
	}


}

function mapDispatchToProps(dispatch) {
	return {
		setPresenceUserStatus: (lessonId, userStatus, groupId) => dispatch(setPresenceUserStatus(lessonId, userStatus, groupId)),
	};
}

export default connect(null, mapDispatchToProps)(Lesson);
