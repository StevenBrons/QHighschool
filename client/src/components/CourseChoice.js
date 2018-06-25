import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Clear from '@material-ui/icons/Clear';

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
				{
					this.getButton(this.props.choices, this.props.possibleChoices, this.props.course)
				}
			</Paper >
		);
	}

	indexOfCourse(list, course) {
		let index = -1;
		list.map((c, i) => {
			if (c.id === course.id) {
				index = i;
			}
			return 0;
		});
		return index;
	}

	getButton(choices, possibleChoices, course) {
		if (this.indexOfCourse(choices, course) > -1) {
			return (
				<Button color="secondary" onClick={this.onChoose.bind(this)}>
					{"Aangemeld"}
					<Clear />
				</Button>
			);
		}

		if (this.indexOfCourse(possibleChoices, course) !== -1) {
			if (choices.filter(c => {
				return c.day === course.day;
			}).length === 1) {
				//Choices already contain a course on this day
				return (
					<Button color="secondary">
						{"Je hebt al een module gekozen voor " + course.day}
					</Button>
				);
			} else {
				return (
					<Button color="secondary" variant="contained" onClick={this.onChoose.bind(this)}>
						{"Aanmelden"}
					</Button>
				);
			}
		} else {
			return null;
		}

	}
}


export default CourseChoice;

