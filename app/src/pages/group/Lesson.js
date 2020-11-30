import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import { Button, Typography } from '@material-ui/core';
import { setPresenceUserStatus } from "../../store/actions";
import { connect } from "react-redux";
import InputField from '../../fields/InputField';
import SelectField from '../../fields/SelectField';

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

	getOptOutButton() {
		if (this.props.lesson.userStatus === "absent") {
			return < div style={{ flex: 1 }}>
				<Button
					style={{ width: "70px", float: "right" }}
					size="small"
					mini
					color="primary"
					onClick={() => this.props.setPresenceUserStatus(this.props.lesson.id, "present", this.props.lesson.courseGroupId)}
				>
					Aanmelden
				</Button>
			</div>
		}
		return < div style={{ flex: 1 }}>
			<Button
				style={{ width: "70px", float: "right" }}
				size="small"
				mini
				color="secondary"
				onClick={() => this.props.setPresenceUserStatus(this.props.lesson.id, "absent", this.props.lesson.courseGroupId)}
			>
				Afmelden
			</Button>
		</div>
	}


	handleChange = (name, value) => {
		this.props.handleChange({
			...this.props.lesson,
			[name]: value,
		});
	}



	getHeader = () => {
		return <Paper
			elevation={this.state.hover ? 2 : 1}
			onMouseEnter={() => this.setState({ hover: true })}
			onMouseLeave={() => this.setState({ hover: false })}
			component="tr"
			style={{ backgroundColor: "#e0e0e0" }}
		>
			<td style={{ display: "flex", flexDirection: "column" }}>
				<Typography>
					Lesnummer
			</Typography>
				<Typography>
					Soort les
			</Typography>
			</td >
			<Typography style={{ flex: 4 }} component="td">
				Onderwerp
		</Typography >
			<Typography style={{ flex: 8 }} component="td">
				Activiteiten
		</Typography >
			<td style={{ display: "flex", flexDirection: "column" }}>
				<Typography>
					Datum
			</Typography>
				<Typography>
					Aanwezigheid
			</Typography >
			</td >
		</Paper >
	}

	getLesson = () => {
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
		>
			<td style={{ display: "flex", flexDirection: "column" }}>
				<Typography color="primary" variant="button" component="td" >
					{"Les " + lesson.numberInBlock}
				</Typography>
				<InputField
					label="Soort les"
					layout={{ area: true }}
					value={lesson.kind}
					editable={this.props.editable}
					onChange={(value) => this.handleChange("kind", value)}
				/>
			</td>
			<InputField
				label="Onderwerp"
				style={{ flex: 4 }}
				value={lesson.subject}
				editable={this.props.editable}
				onChange={(value) => this.handleChange("subject", value)}
				td
			/>
			<InputField
				label="Activiteiten"
				style={{ flex: 8 }}
				value={lesson.activities}
				editable={this.props.editable}
				onChange={(value) => this.handleChange("activities", value)}
				td
			/>
			<td style={{ display: "flex", flexDirection: "column" }}>
				<Typography component="td">
					{displayDate}
				</Typography>
				<SelectField
					label="Aanwezigheid"
					value={lesson.presence}
					editable={this.props.editable}
					onChange={(value) => this.handleChange("presence", value)}
					options={[{ label: "Noodzakelijk", value: "required" }, { label: "Eigen keuze", value: "optional" }, { label: "Geen bijeenkomst", value: "unrequired" }]}
				/>
				{
					this.props.userIsMemberOfGroup && this.props.role === "student" ? this.getOptOutButton() : null
				}
			</td>
		</Paper >;
	}


	render() {
		if (this.props.lesson.id === -1) {
			return this.getHeader();
		} else {
			return this.getLesson();
		}
	}


}

function mapDispatchToProps(dispatch) {
	return {
		setPresenceUserStatus: (lessonId, userStatus, groupId) => dispatch(setPresenceUserStatus(lessonId, userStatus, groupId)),
	};
}

export default connect(null, mapDispatchToProps)(Lesson);
