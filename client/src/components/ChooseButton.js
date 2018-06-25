import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';
import { User } from "../Data";

class ChooseButton extends Component {

	constructor(props) {
		super(props);
		this.state = {
			possibleChoices: [],
		}
	}

	componentWillMount() {
		User.getPossibleChoices().then((possibleChoices) => {
			this.setState({
				possibleChoices,
			});
		});
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

	render() {
		const props = this.props;
		if (this.indexOfCourse(props.choices, props.course) > -1) {
			return (
				<Button color="secondary" onClick={() => props.onChoose(props.course)} style={this.props.style}>
					{"Aangemeld"}
					<Clear />
				</Button>
			);
		}

		if (this.indexOfCourse(this.state.possibleChoices, props.course) !== -1) {
			if (props.choices.filter(c => {
				return c.day === props.course.day;
			}).length === 1) {
				//Choices already contain a course on this day
				return (
					<Button color="secondary" style={this.props.style}>
						{"Je hebt al een module gekozen voor " + props.course.day}
					</Button>
				);
			} else {
				return (
					<Button color="secondary" variant="contained" onClick={() => props.onChoose(props.course)} style={this.props.style}>
						{"Aanmelden"}
					</Button>
				);
			}
		} else {
			return null;
		}

	}
}

export default ChooseButton;
