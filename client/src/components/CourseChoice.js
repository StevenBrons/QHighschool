import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';

class CourseChoice extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
		}
	}

	onChoose(event) {
		this.props.onChoose(this.props.course);
	}

	render() {
		const props = this.props
		return (
			<Card
				className="Course"
				elevation={this.state.hover ? 8 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
			>
				<CardHeader
					title={props.course.name}
					subheader={"Periode " + props.course.period}
				/>
				<CardContent>
					{props.course.description}
				</CardContent>
				<CardActions>
					{
						this.getButton(props.choices, props.course, props.maxChoices)
					}
				</CardActions>
			</Card >
		);
	}

	getButton(choices, course, maxChoices) {
		if (choices.indexOf(course.key) !== -1) {
			return (
				<Button size="large" color="primary" onClick={this.onChoose.bind(this)}>
					{this.getButtonText(choices.indexOf(course.key))}
					<Clear />
				</Button>
			);
		} else {
			if (choices.length < maxChoices) {
				return (
					<Button variant="contained" size="large" color="primary" onClick={this.onChoose.bind(this)}>
						{this.getButtonText(choices.length)}
					</Button>
				);
			}
		}
	}

	getButtonText(num) {
		switch (num) {
			case 0: return "Eerste keuze";
			case 1: return "Tweede keuze";
			case 2: return "Derde keuze";
			case 4: return "Vierde keuze";
			case 5: return "Vijfde keuze";
			case 6: return "Zesde keuze";
			case 7: return "Zevende keuze";
			case 8: return "Achste keuze";
			case 9: return "Negende keuze";
			default: return num + "ste keuze";
		}
	}

}


export default CourseChoice;

