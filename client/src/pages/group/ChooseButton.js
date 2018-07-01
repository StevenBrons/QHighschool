import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';
import { connect } from 'react-redux';
import { toggleEnrollment, getEnrollableGroups, getEnrolLments } from '../../store/actions';
import Progress from '../../components/Progress';

class ChooseButton extends Component {

	constructor(props) {
		super(props);
		this.props.getEnrollableGroups();
		this.props.getEnrolLments();
	}

	render() {
		const props = this.props;

		if (props.loading) {
			return (
				<Progress size={30}/>
			)
		}

		if (props.hasChosen) {
			return (
				<Button color="secondary" onClick={() => this.props.toggleEnrollment(props.group)} style={props.style}>
					{"Aangemeld"}
					<Clear />
				</Button>
			);
		}

		if (this.props.canChoose) {
			if (this.props.hasChosenDay) {
				return (
					<Button color="secondary" style={this.props.style}>
						{"Je hebt al een module gekozen voor " + props.group.day}
					</Button>
				);
			} else {
				return (
					<Button color="secondary" variant="contained" onClick={() => this.props.toggleEnrollment(props.group)} style={this.props.style}>
						{"Aanmelden"}
					</Button>
				);
			}
		} else {
			return null;
		}

	}
}

function mapStateToProps(state, ownProps) {
	if (state.enrollments == null || state.enrollableGroups == null) {
		return {
			loading: true,
		}
	}

	return {
		canChoose: state.enrollableGroups.map(e => e.id).indexOf(ownProps.group.id) !== -1,
		hasChosen: state.enrollments.map(e => e.id).indexOf(ownProps.group.id) !== -1,
		hasChosenDay: state.enrollments.map(e => e.day).indexOf(ownProps.group.day) !== -1,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		toggleEnrollment: (group) => dispatch(toggleEnrollment(group)),
		getEnrollableGroups: () => dispatch(getEnrollableGroups()),
		getEnrolLments: () => dispatch(getEnrolLments()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseButton);
