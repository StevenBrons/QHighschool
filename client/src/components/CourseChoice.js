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

	onChoose() {
		this.props.onChoose(this.props.course);
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
				onMouseEnter={this.enter.bind(this)}
				onMouseLeave={this.exit.bind(this)}
				style={this.state.style}
			>
				<Typography variant="headline" color="primary">
					{this.props.course.name}
				</Typography>
				<Typography variant="subheading" color="textSecondary" paragraph>
					{"Periode " + this.props.course.period + " - " + this.props.course.day}
				</Typography>
				<Typography paragraph>
					{this.props.course.description}
				</Typography>
				<ChooseButton
					course={this.props.course}
					choices={this.props.choices}
					onChoose={this.props.onChoose}
				/>
			</Paper >
		);
	}


}


export default CourseChoice;

