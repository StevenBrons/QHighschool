import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChooseButton from './ChooseButton';

class CourseChoice extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
			style: {
				width: "400px",
				height: "200px",
				padding: "20px",
				verticalAlign: "top",
				margin: "20px",
				display: "inline-block",
				cursor: "pointer",
			}
		}
	}

	enter() {
		this.props.preventCollapse(true);
		this.setState({ hover: true })
	}

	exit() {
		this.props.preventCollapse(false);
		this.setState({ hover: false })
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

