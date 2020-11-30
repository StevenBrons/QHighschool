import React, { Component } from "react";
import { connect } from 'react-redux';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@material-ui/core/";
import { Add, Delete, Edit } from "@material-ui/icons";
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
			isEditDialog: false,
			newSubjectId: "",
			newSubjectProfile: "",
			newSubjectStartYear: this.props.schoolYear,
			isValid: false,
		}
	}

	componentDidMount() {
		this.props.getSubjects();
	}

	toggleDialog = () => {
		this.setState({
			isDialogOpen: !this.state.isDialogOpen,
			newSubjectId: "",
			newSubjectProfile: "",
			newSubjectStartYear: this.props.schoolYear,
			isEditDialog: false,
		});
	}

	onChange = (field, value) => {
		let newState = {
			...this.state,
			[field]: value,
		}
		if (newState.newSubjectId && newState.newSubjectProfile) {
			newState.isValid = true;
		}
		this.setState(newState);
	}

	updateExamSubjects = () => {
		const examSubjects = this.props.examSubjects.filter(({ id }) => id !== this.state.newSubjectId);
		this.props.onChange("examSubjects", JSON.stringify([
			...examSubjects,
			{
				id: this.state.newSubjectId,
				inProfile: this.state.newSubjectProfile === "T",
				startSchoolYear: this.state.newSubjectStartYear,
			}
		]));

		this.setState({
			isDialogOpen: false,
		});
	}

	removeExamSubject = (subjectId) => {
		const examSubjects = this.props.examSubjects.filter(({ id }) => id !== subjectId);
		this.props.onChange("examSubjects", JSON.stringify(examSubjects));
	}

	editExamSubject = (subjectId) => {
		const examSubject = this.props.examSubjects.filter(({ id }) => id === subjectId)[0];
		this.setState({
			isDialogOpen: true,
			newSubjectId: subjectId,
			newSubjectProfile: examSubject.inProfile ? "T" : "F",
			newSubjectStartYear: examSubject.startSchoolYear,
			isValid: true,
			isEditDialog: true,
		});
	}

	getExamSubjectListItem = ({ id, name, inProfile, startSchoolYear = "onbekend" }) => {
		return <tr key={id} className="examSubjectListItem">
			<td>
				{name}
			</td>
			<td>
				{inProfile ? "(in profieldeel)" : "(in vrije deel)"}
			</td>
			<td>
				{startSchoolYear}
			</td>
			{this.props.editableAdmin &&
				<td style={{ textAlign: "right" }}>
					<IconButton onClick={() => this.editExamSubject(id)}>
						<Edit />
					</IconButton>
					<IconButton onClick={() => this.removeExamSubject(id)}>
						<Delete />
					</IconButton>
				</td>

			}
		</tr>
	}

	getDialog = () => {
		const p = this.props;
		let availableSubjects = map(p.subjects, (x) => x).filter(({ canDoExam }) => canDoExam);
		if (!this.state.isEditDialog) {
			availableSubjects = availableSubjects.filter(({ id }) => { return p.examSubjects.filter((x) => x.id + "" === id + "").length === 0 })
		}
		return <Dialog onClose={this.toggleDialog} open={this.state.isDialogOpen}>
			<DialogTitle onClose={this.toggleDialog}>
				Examenvak toevoegen
			</DialogTitle>
			<DialogContent dividers>
				<Typography gutterBottom>
					In welk vak wil je examen doen?
				</Typography>
				<SelectField
					value={this.state.newSubjectId}
					options={availableSubjects.map(({ id, name }) => { return { label: name, value: id } })}
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
				{
					<div>
						<Typography gutterBottom>
							Wat is je startcohort?
				</Typography>
						<SelectField
							value={this.state.newSubjectStartYear}
							options={this.props.possibleYears}
							onChange={(value) => this.onChange("newSubjectStartYear", value)}
						/>
					</div>
				}
			</DialogContent>
			<DialogActions>
				<Button onClick={this.toggleDialog}>
					Annuleren
				</Button>
				<Button autoFocus onClick={this.updateExamSubjects} color="primary" disabled={!this.state.isValid}>
					Opslaan
			</Button>
			</DialogActions>
		</Dialog>
	}

	render() {
		const p = this.props;
		const examSubjectComponents =
			p.examSubjects
				.filter(({ id }) => p.subjects[id])
				.map(({ id, inProfile, startSchoolYear }) => { return { id, inProfile, name: p.subjects[id].name, startSchoolYear } })
				.map(this.getExamSubjectListItem);

		return (
			<div>
				<Typography variant="h6" color="secondary">
					Examenvakken
				</Typography>
				<Typography>
					In deze vakken wil ik bij de Q-highschool examen doen:
				</Typography>
				{p.examSubjects !== [] ?
					<table style={{ marginTop: "10px" }}>
						<tbody>
							<tr className="examSubjectListItem">
								<th>Vak</th>
								<th></th>
								<th>Start cohort</th>
							</tr>
							{examSubjectComponents}
						</tbody>
					</table>
					: null
				}
				{this.props.editableUser &&
					<Button variant="contained" color="primary" startIcon={<Add />} onClick={this.toggleDialog} >
						Examenvak toevoegen
					</Button>
				}
				{this.getDialog()}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		subjects: state.subjects || [],
		examSubjects: (ownProps.user.examSubjects || "").length > 2 ? JSON.parse(ownProps.user.examSubjects) : [],
		schoolYear: state.schoolYear,
		possibleYears: state.possibleYears,
		...ownProps,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamSubjects);