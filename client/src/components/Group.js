import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChooseButton from './ChooseButton';

const CARD_STYLE = {
	width: "430px",
	height: "210px",
	padding: "20px",
	verticalAlign: "top",
	margin: "20px",
	display: "inline-block",
	cursor: "pointer",
}

const PAGE_STYLE = {
}

const LINE_STYLE = {
}

class CourseChoice extends Component {

	constructor(props) {
		super(props);
		if (this.props.group == null) {
			throw new Error("GroupId cannot be null");
		}
		let display = this.props.display;
		if (display == null) {
			display = "card";
		}
		let style;
		switch (display) {
			case "line":
				style = LINE_STYLE;
				break;
			case "card":
				style = CARD_STYLE;
				break;
			case "page":
				style = PAGE_STYLE;
				break;
			default:
				break;
		}

		this.state = {
			display: this.props.display ? "card" : this.props.display,
			hover: false,
			style: style,
		}
	}

	render() {
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<Typography variant="headline" color="primary">
					{this.props.group.courseName}
				</Typography>
				<Typography variant="subheading" color="textSecondary" paragraph>
					{"Periode " + this.props.group.period + " - " + this.props.group.day}
				</Typography>
				<Typography paragraph>
					{this.props.group.courseDescription}
				</Typography>
				<ChooseButton
					group={this.props.group}
				/>
			</Paper >
		);
	}


}


export default CourseChoice;

