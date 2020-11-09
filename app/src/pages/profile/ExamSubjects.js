import React, { Component } from "react";
import { connect } from 'react-redux';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core/";
import { Add } from "@material-ui/icons";
import {
	getSubjects,
} from "../../store/actions";
import SelectField from "../../fields/SelectField";
import { map } from "lodash";

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
		this.props.onChange("examSubjects", JSON.stringify([
			...this.props.examSubjects,
			{ id: this.state.newSubjectId, inProfile: this.state.newSubjectProfile === "T" }
		]));

		this.setState({
			isDialogOpen: false,
			newSubjectId: null,
			newSubjectProfile: null,
			isValid: false,
		})
	}

	getExamSubjectListItem = ({ id, name, inProfile }) => {
		return <tr key={id} className="examSubjectListItem">
			<th>
				{name}
			</th>
			<td>
				{inProfile ? "(in profieldeel)" : "(in vrije deel)"}
			</td>
		</tr>
	}

	render() {
		const p = this.props;
		const examSubjectComponents =
			p.examSubjects
				.filter(({ id }) => p.subjects[id])
				.map(({ id, inProfile }) => { return { id, inProfile, name: p.subjects[id].name } })
				.map(this.getExamSubjectListItem);
		const availableSubjects = map(p.subjects, (x) => { return { ...x } })
			.filter(({ canDoExam }) => canDoExam)
			.filter(({ id }) => { return p.examSubjects.filter((x) => x.id + "" === id + "").length === 0 })
			.map(({ id, name }) => { return { label: name, value: id } });

		return (
			<div>
				<Typography variant="h6" color="secondary">
					Examenvakken
				</Typography>
				<Typography>
					In deze vakken wil ik bij de Q-highschool examen doen:
				</Typography>
				<table style={{ marginTop: "10px" }}>
					<tbody>
						{examSubjectComponents}
					</tbody>
				</table>
				{this.props.editableUser &&
					<Button variant="contained" color="primary" startIcon={<Add />} onClick={this.toggleDialog} >
						Examenvak toevoegen
					</Button>
				}
				<Dialog onClose={this.toggleDialog} aria-labelledby="customized-dialog-title" open={this.state.isDialogOpen}>
					<DialogTitle id="customized-dialog-title" onClose={this.toggleDialog}>
						Examenvak toevoegen
        	</DialogTitle>
					<DialogContent dividers>
						<Typography gutterBottom>
							In welk vak wil je examen doen?
          	</Typography>
						<SelectField
							value={this.state.newSubjectId}
							options={availableSubjects}
							onChange={(value) => this.onChange("newSubjectId", value)}
						/>
						<Typography gutterBottom>
							Volg je dit vak binnen je profieldeel of in het vrije deel?
          	</Typography>
						<SelectField
							value={this.state.newSubjectProfile}
							options={[{ label: "In profieldeel", value: "T" }, { label: "In vrije deel", value: "F" }]}
							onChange={(value) => this.onChange("newSubjectProfile", value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.toggleDialog}>
							Annuleren
          </Button>
						<Button autoFocus onClick={this.updateExamSubjects} color="primary" disabled={this.state.isValid}>
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
		examSubjects: (ownProps.user.examSubjects || "").length > 2 ? JSON.parse(ownProps.user.examSubjects) : [],
		...ownProps,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamSubjects);