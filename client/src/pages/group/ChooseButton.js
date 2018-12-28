import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';
import { connect } from 'react-redux';
import { toggleEnrollment, getEnrollableGroups, getEnrolLments } from '../../store/actions';
import Progress from '../../components/Progress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

class ChooseButton extends Component {

	constructor(props) {
		super(props);
		this.props.getEnrollableGroups();
		this.props.getEnrolLments();

		this.state = {
			dialogOpen: false,
		}
	}

	getDialog() {
		return (
			<Dialog
				open={this.state.dialogOpen}
				keepMounted
			>
				<DialogTitle>
					Inschrijven
				</DialogTitle>
				{this.props.hasChosenDay && !this.props.hasChosen ?
					<div>
						<DialogContent>
							<DialogContentText>
								<Typography color="error" style={{ fontSize: "16px" }}>
									{"Je hebt al een module gekozen voor " + this.props.group.day + "!"}
								</Typography>
								Schrijf je eerst uit voor de module
								<Typography color="primary" variant="title" style={{ fontSize: "16px", display: "inline-block", margin: "5px" }}>
									{this.props.chosenDayGroupName}
								</Typography>
								om je in te kunnen schrijven
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button color="primary" variant="contained">
								Sluiten
							</Button>
						</DialogActions>
					</div>
					:
					<div>
						<DialogContent>
							{this.props.group.remarks && !this.props.hasChosen &&
								<Typography color="error" variant="error">
									{"Voorkennis: " + this.props.group.remarks}
								</Typography>
							}
							<DialogContentText>
								{this.props.hasChosen ?
									"Weet je zeker dat je wilt uitschrijven voor de module" :
									"Weet je zeker dat je wilt inschrijven voor de module"
								}
								<Typography color="primary" variant="title" style={{ fontSize: "16px", display: "inline", margin: "5px" }}>
									{this.props.group.courseName}
								</Typography>
								?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button color="default">
								Annuleren
					</Button>
							{this.props.hasChosen ?
								<Button onClick={() => this.handleEnroll()} color="primary">
									Uitschrijven
							<Clear />
								</Button> :
								<Button onClick={() => this.handleEnroll()} variant="contained" color="primary">
									Inschrijven
							</Button>
							}
						</DialogActions>
					</div>
				}
			</Dialog>
		);
	}

	handleEnroll() {
		this.props.toggleEnrollment(this.props.group);
	}

	onButtonClick() {
		this.setState({
			dialogOpen: !this.state.dialogOpen,
		});
	}

	render() {
		const props = this.props;
		let dialog = this.state.dialogOpen ? this.getDialog.bind(this)(props.group.courseName, props.hasChosen, props.group.remarks) : null;
		if (props.loading) {
			return (
				<Progress size={30} />
			)
		}

		if (props.hasChosen) {
			return (
				<Button color="primary" onClick={() => this.onButtonClick()} style={props.style}>
					{"Ingeschreven"}
					<Clear />
					{dialog}
				</Button>
			);
		}

		if (this.props.canChoose) {
			return (
				<Button color="primary" variant="contained" onClick={() => this.onButtonClick()} style={this.props.style}>
					{"Inschrijven" + (this.props.hasChosenDay ? "*" : "")}
					{dialog}
				</Button>
			);
		} else {
			return (
				<Button disabled color="primary" onClick={() => this.onButtonClick()} style={props.style}>
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
