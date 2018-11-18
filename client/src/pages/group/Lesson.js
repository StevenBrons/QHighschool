import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Field from '../../components/Field';

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
				<Paper
					elevation={this.state.hover ? 4 : 2}
					onMouseEnter={() => this.setState({ hover: true })}
					onMouseLeave={() => this.setState({ hover: false })}
					component="tr"
				>
					<td style={{ display: "flex", flexDirection: "column" }}>
						<Field style={{ fontWeight: "bold" }} value="Lesnummer" />
						<Field style={{ fontWeight: "bold" }} value="Soort les" />
					</td>
					<Field style={{ flex: 4, fontWeight: "bold" }} value="Onderwerp" td />
					<Field style={{ flex: 8, fontWeight: "bold" }} value="Activiteiten" td />
					<td style={{ display: "flex", flexDirection: "column" }}>
						<Field style={{ fontWeight: "bold" }} value="Datum" right />
						<Field style={{ fontWeight: "bold" }} value="Aanwezigheid" right />
					</td>
				</Paper>
			);
		}
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				component="tr"
			>
				<td style={{ display: "flex", flexDirection: "column" }}>
					<Field
						variant="body1"
						color="primary"
						style={{ fontWeight: "bold" }}
						value={"Les " + lesson.numberInBlock}
					/>
					<Field
						label="Soort les"
						name="kind"
						variant="body1"
						value={lesson.kind}
						editable={this.props.editable}
						onChange={this.handleChange}
					/>
				</td>
				<Field
					label="Onderwerp"
					area
					name="subject"
					variant="body1"
					style={{ flex: 4 }}
					value={lesson.subject}
					editable={this.props.editable}
					onChange={this.handleChange}
					td
				/>
				<Field
					label="Activiteiten"
					area
					name="activities"
					variant="body1"
					style={{ flex: 8 }}
					value={lesson.activities}
					editable={this.props.editable}
					onChange={this.handleChange}
					td
				/>
				<td style={{ display: "flex", flexDirection: "column" }}>
					<Field
						variant="body1"
						right
						value={this.getWeekdayString(new Date(lesson.date).getDay()) + " " + new Date(lesson.date).getDate() + "-" + (new Date(lesson.date).getMonth() + 1) + "-" + new Date(lesson.date).getFullYear()}
					/>
					<Field
						name="presence"
						label="Aanwezigheid"
						labelVisible
						right
						variant="body1"
						value={lesson.presence}
						editable={this.props.editable}
						onChange={this.handleChange}
						options={[{ label: "Noodzakelijk", value: "required" }, { label: "Eigen keuze", value: "optional" }, { label: "Geen bijeenkomst", value: "unrequired" }]}
					/>
				</td>
			</Paper>
		);
	}


}


export default Lesson;

