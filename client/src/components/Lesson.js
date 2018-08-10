import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import IconButton from '@material-ui/core/IconButton';

class Lesson extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
			style: {
				width: "100%",
				height: "45px",
				margin: "0px",
				marginTop: "10px",
				marginBottom: "10px",
				padding: "10px",
				display: "flex",
			},
		}
	}

	getWeekdayString(number) {
		return ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"][number];
	}

	render() {
		const lesson = this.props.lesson;
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<Typography variant="title" color="primary" style={{ flex: 1 }}>
					{"Les " + lesson.numberInBlock}
				</Typography>
				<Typography variant="subheading" style={{ flex: 4 }}>
					{lesson.activities}
				</Typography>
				<Typography variant="subheading" style={{ flex: 2 }}>
					{lesson.kind}
				</Typography>
				<Typography variant="subheading" style={{ flex: 1 }}>
					{this.getWeekdayString(new Date(lesson.date).getDay()) + " " + new Date(lesson.date).getDate() + "-" + (new Date(lesson.date).getMonth() + 1) + "-" + new Date(lesson.date).getFullYear()}
				</Typography>
			</Paper >
		);
	}


}


export default Lesson;

