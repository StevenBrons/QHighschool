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
					elevation={this.state.hover ? 2 : 1}
					onMouseEnter={() => this.setState({ hover: true })}
					onMouseLeave={() => this.setState({ hover: false })}
					component="tr"
					style={{ backgroundColor: "#e0e0e0" }}
				>
					<td style={{ display: "flex", flexDirection: "column" }}>
						<Field style={{ fontWeight: "bold" }} value="Lesnummer" />
						<Field style={{ fontWeight: "bold" }} value="Soort les" />
					</td>
					<Field style={{ flex: 4, fontWeight: "bold" }} value="Onderwerp" layout={{ td: true }} />
					<Field style={{ flex: 8, fontWeight: "bold" }} value="Activiteiten" layout={{ td: true }} />
					<td style={{ display: "flex", flexDirection: "column" }}>
						<Field style={{ fontWeight: "bold" }} value="Datum" layout={{ alignment: "right" }} />
						<Field style={{ fontWeight: "bold" }} value="Aanwezigheid" layout={{ alignment: "right" }} />
					</td>
				</Paper>
			);
		}
		return (
			<Paper
				elevation={this.state.hover ? 2 : 1}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				component="tr"
			>
				<td style={{ display: "flex", flexDirection: "column" }}>
					<Field
						color="primary"
						layout={{ area: true }}
						style={{ fontWeight: "bold" }}
						value={"Les " + lesson.numberInBlock}
					/>
					<Field
						label="Soort les"
						name="kind"
						layout={{ area: true }}
						value={lesson.kind}
						editable={this.props.editable}
						onChange={this.handleChange}
					/>
				</td>
				<Field
					label="Onderwerp"
					name="subject"
					style={{ flex: 4 }}
					value={lesson.subject}
					editable={this.props.editable}
					onChange={this.handleChange}
					layout={{ td: true, area: true }}
				/>
				<Field
					label="Activiteiten"
					name="activities"
					style={{ flex: 8 }}
					value={lesson.activities}
					editable={this.props.editable}
					onChange={this.handleChange}
					layout={{ td: true, area: true }}
				/>
				<td style={{ display: "flex", flexDirection: "column" }}>
					<Field
						layout={{ alignment: "right" }}
						value={this.getWeekdayString(new Date(lesson.date).getDay()) + " " + new Date(lesson.date).getDate() + "-" + (new Date(lesson.date).getMonth() + 1) + "-" + new Date(lesson.date).getFullYear()}
					/>
					<Field
						name="presence"
						label="Aanwezigheid"
						style={{ labelVisible: true }}
						layout={{ alignment: "right" }}
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

