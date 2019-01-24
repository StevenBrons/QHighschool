import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';
import { connect } from 'react-redux';
import { toggleEnrollment, getEnrollableGroups, getEnrolLments } from '../../store/actions';
import Progress from '../../components/Progress';
import EnrollmentPopup from './EnrollmentPopup';

class ChooseButton extends Component {

	constructor(props) {
		super(props);
		this.props.getEnrollableGroups();
		this.props.getEnrolLments();
		this.state = {
			dialogOpen: false,
		}
	}

	preventPopupClose(preventClose) {
		this.preventClose = preventClose;
	}

	handlePopup(doEnroll) {
		if (doEnroll) {
			this.props.toggleEnrollment(this.props.group);
		}
		if (!this.preventClose) {
			this.setState({
				dialogOpen: !this.state.dialogOpen,
			});
		}
	}

	render() {
		let currentEnrollPeriod = 3; // replace with variable in database
		const props = this.props;
		console.log("props:" , this.props);
		let dialog = this.state.dialogOpen ?
			<EnrollmentPopup
				group={props.group}
				hasChosen={props.hasChosen}
				handlePopup={this.handlePopup.bind(this)}
				hasChosenDay={props.hasChosenDay}
				chosenDayGroupName={props.chosenDayGroupName}
				preventPopupClose={this.preventPopupClose.bind(this)}
			/> : null;

		if (props.loading) {
			return (
				<Progress size={30} />
			)
		}

		if (props.hasChosen) {
			return (
				<Button color="primary" onClick={() => this.handlePopup(false)} style={props.style}>
					{"Ingeschreven"}
					<Clear />
					{dialog}
				</Button>
			);
		}

		if (this.props.canChoose) {
			return (
				<Button color="primary" variant="contained" onClick={() => this.handlePopup(false)} style={this.props.style}>
					{"Inschrijven" + (this.props.hasChosenDay ? "*" : "")}
					{dialog}
				</Button>
			);
		} else if (props.group.period < currentEnrollPeriod){
			return (
				<Button disabled color="primary" onClick={() => this.handlePopup(false)} style={props.style}>
					Inschrijfperiode verlopen
					{dialog}
				</Button>
			);
		} else {
			return (
				<Button disabled color="primary" onClick={() => this.handlePopup(false)} style={props.style}>
					Coming Soon
					{dialog}
				</Button>
			);
		}

	}
}

function mapStateToProps(state, ownProps) {
	if (state.users[state.userId].enrollmentIds == null || state.enrollableGroups == null) {
		return {
			loading: true,
		}
	}

	const occupiedDayIndex = state.users[state.userId].enrollmentIds.map(id => state.groups[id].day).indexOf(ownProps.group.day);
	const hasChosenDay = occupiedDayIndex !== -1;

	return {
		canChoose: state.enrollableGroups.map(e => e.id).indexOf(ownProps.group.id) !== -1,
		hasChosen: state.users[state.userId].enrollmentIds.indexOf(ownProps.group.id) !== -1,
		hasChosenDay,
		chosenDayGroupName: hasChosenDay ? state.groups[state.users[state.userId].enrollmentIds[occupiedDayIndex]].courseName : null,
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
