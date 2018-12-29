import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';

class EnrollmentPopup extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.hasChosen) {
			return { page: "cancel", ...prevState };
		}
		if (nextProps.hasChosenDay) {
			return { page: "hasChosenDay", ...prevState };
		}
		if (nextProps.group.remarks != null && nextProps.group.remarks.length > 1) {
			return { page: "remarks", ...prevState };
		}
		return { page: "confirm", ...prevState };
	}

	getDuplicatePage() {
		return (
			<Dialog open keepMounted >
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
			</Dialog>
		);
	}

	getCancelPage() {
		return (
			<Dialog open keepMounted >
				<DialogTitle>
					Uitschrijven
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Weet je zeker dat je wilt uitschrijven voor de module
						<Typography color="primary" variant="title" style={{ fontSize: "16px", display: "inline", margin: "5px" }}>
							{this.props.group.courseName}
						</Typography> ?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="default">
						Annuleren
					</Button>
					<Button name="test" onClick={() => this.props.handlePopup(true)} color="primary">
						Uitschrijven
						<Clear />
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	getConfirmPage() {
		return (
			<Dialog open keepMounted >
				<DialogTitle>
					Inschrijven
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Weet je zeker dat je wilt inschrijven voor de module
						<Typography color="primary" variant="title" style={{ fontSize: "16px", display: "inline", margin: "5px" }}>
							{this.props.group.courseName}
						</Typography> ?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="default">
						Annuleren
					</Button>
					<Button name="test" onClick={() => this.props.handlePopup(true)} variant="contained" color="primary">
						Inschrijven
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	getRemarkPage() {
		return (
			<Dialog open keepMounted >
				<DialogTitle>
					Opmerkingen
				</DialogTitle>
				<DialogContent>
					<Typography>
						{this.props.group.remarks}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button color="default">
						Annuleren
					</Button>
					<Button onClick={() => {
						this.props.preventPopupClose(true);
						this.setState({ page: "confirm" })
					}} color="primary">
						Verder
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	render() {
		this.props.preventPopupClose(false);
		switch (this.state.page) {
			case "remarks":
				return this.getRemarkPage();
			case "cancel":
				return this.getCancelPage();
			case "confirm":
			default:
				return this.getConfirmPage();
		}
	}
}


export default EnrollmentPopup;

