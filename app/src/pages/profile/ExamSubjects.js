import React, { Component } from "react";
import { connect } from 'react-redux';
import { Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core/";
import { Add } from "@material-ui/icons";
import {
	getSubjects,
} from "../../store/actions";
import Field from "../../components/Field";

class ExamSubjects extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isDialogOpen: false,
			newSubjectId: null,
			newSubjectProfile: null,
			isValid: false,
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// let subjects = [];
		// for (let id in this.props.subjects) {
		// 	subjects.push({ value: id, label: this.props.subjects[id].name });
		// }
		// let subIds = (this.props.examSubjectIds || "").split(",").map(id => { });
		// let subProIds = (this.props.examProfileSubjectIds || "").split(",");
		// let examSubjects = subIds.concat(subProIds)
		// 	.filter((id) => this.props.subjects[id])
		// 	.map((id) => { return { id, name: this.props.subjects[parseInt(id)].name } })
		// return {
		// 	...prevState,
		// 	examSubjectObjects: examSubjects,

		// }
	}

	componentDidMount() {
		this.props.getSubjects();
	}

	toggleDialog = () => {
		this.setState({
			isDialogOpen: !this.state.isDialogOpen,
		})
	}

	onChange = (field, value) => {
		let newState = {
			...this.props.state,
			[field]: value,
		}
		if (newState.newSubjectId && newState.newSubjectProfile) {
			newState.isValid = true;
		}
		this.setState(newState);
	}

	updateExamSubjects = () => {
		if (this.state.newSubjectProfile === "true") {
			this.props.onChange("examProfileSubjectIds", this.props)
		} else {
			this.props.onChange("examSubjectIds")
		}

		this.setState({
			isDialogOpen: false,
			newSubjectId: null,
			newSubjectProfile: null,
			isValid: false,
		})
	}

	render() {
		const examSubjects = this.state.examSubjects
			.map(({ id, name }) => <ListItemText primary={name + (subProIds.indexOf(id) !== -1 ? "(IN PROFIEL)" : "")} key={id} />);

		return (
			<div>
				<Typography variant="h6" color="secondary">
					Examen vakken
				</Typography>
				<Typography>
					In deze vakken wil ik bij de Q-Highschool examen doen:
				</Typography>
				<List>
					<ListItem>
						{examSubjects}
					</ListItem>
				</List>
				<Button variant="contained" color="primary" startIcon={<Add />} onClick={this.toggleDialog} >
					Nieuw examenvak
				</Button>
				<Dialog onClose={this.toggleDialog} aria-labelledby="customized-dialog-title" open={this.state.isDialogOpen}>
					<DialogTitle id="customized-dialog-title" onClose={this.toggleDialog}>
						Nieuw examenvak
        	</DialogTitle>
					<DialogContent dividers>
						<Typography gutterBottom>
							In welk vak wil je examen doen?
          	</Typography>
						<Field
							editable
							label="Nieuw examenvak"
							value={this.state.newSubjectId}
							options={subjects}
							style={{
								margin: "dense",
							}}
							layout={{
								area: true,
							}}
							onChange={(value) => this.onChange("newSubjectId", value)}
						/>
						<Typography gutterBottom>
							Volg je dit vak binnen je profiel of in het vrije deel?
          	</Typography>
						<Field
							editable
							label="Nieuw examenvak"
							value={this.state.newSubjectProfile}
							options={[{ label: "In profiel", value: "true" }, { label: "In vrije deel", value: "false" }]}
							style={{
								margin: "dense",
							}}
							layout={{
								area: true,
							}}
							onChange={(value) => this.onChange("newSubjectProfile", value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClose={this.toggleDialog}>
							Annuleren
          </Button>
						<Button autoFocus onClose={this.updateExamSubjects} color="primary" disabled={this.state.isValid}>
							Opslaan
          	</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		subjects: state.subjects || [],
		...ownProps,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamSubjects);