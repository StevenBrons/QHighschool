import React, { Component } from 'react';

import Field from '../../components/Field';
import EnsureSecureLogin from '../../components/EnsureSecureLogin';
import { Tooltip, TableSortLabel, Typography, Paper } from '@material-ui/core';
import InputField from '../../fields/InputField';
import SelectField from '../../fields/SelectField';

const CHECK_FORMATS = [{
	label: "Gehaald",
	value: "passed",
},
{
	label: "Niet gehaald",
	value: "failed",
},
{
	label: "Niet deelgenomen",
	value: "ND",
}];

const STEPWISE_FORMATS = [{
	label: "Onvoldoende",
	value: "O",
},
{
	label: "Voldoende",
	value: "V",
},
{
	label: "Goed",
	value: "G",
},
{
	label: "Niet deelgenomen",
	value: "ND",
}]

const EVALUATION_FORMATS = [{
	label: "vink",
	value: "check",
	options: CHECK_FORMATS,
},
{
	label: "trapsgewijs",
	value: "stepwise",
	options: STEPWISE_FORMATS,
}, {
	label: "cijfer",
	value: "decimal",
	options: "decimal",
}];

function getEvaluationColor(ev) {
	if (ev.assesment === "ND" || ev.assesment == null) {
		return "#673ab7";
	}
	switch (ev.type) {
		case "stepwise":
			return "#3f51b5";
		case "check":
			return "#009688";
		case "decimal":
			return "#00bcd4"
		default:
			return "#673ab7";
	}
}

function translateAssessment(evaluation) {
	let { assesment, type } = evaluation;
	if ((assesment + "").toUpperCase() === "ND") {
		return "ND";
	}
	switch (type) {
		case "decimal":
			return (parseFloat((assesment + "").replace(",", ".")).toFixed(1) + "").replace(".", ",");
		case "stepwise":
			return STEPWISE_FORMATS.filter(({ label, value }) => value === assesment)[0].label;
		case "check":
			return CHECK_FORMATS.filter(({ label, value }) => value === assesment)[0].label;
		default:
			return "---"
	}
}


/**
 * Function that determines whether a row in the portfolio should be present
 * or omitted.
 *
 * @param evaluation The evaluation object.
 * @returns {boolean} True if the row should be in the portfolio.
 */
function isCertificateWorthy(evaluation) {
	if (evaluation != null) {
		const assesment = evaluation.assesment + "";
		switch (evaluation.type) {
			case "decimal":
				return parseFloat(assesment.replace(/,/g, ".")) >= 6.0;
			case "stepwise":
				return assesment === "G" || assesment === "V";
			case "check":
				return assesment === "passed";
			default:
				return false;
		}
	}

	return false;
}


class EvaluationField extends Component {

	render() {
		const e = this.props.evaluation;
		if (e.type === "decimal") {
			return <InputField
				validate={{ min: 1, max: 10, type: "decimalGrade", notEmpty: true }}
				td
				label="Beoordeling"
				name={e.userId}
				value={e.assesment ? e.assesment : ""}
				editable={this.props.editable}
				onChange={this.props.onChange}
			/>
		} else {
			return <SelectField
				name={e.userId}
				label="Beoordeling"
				td
				value={e.assesment ? e.assesment : ""}
				options={EVALUATION_FORMATS.filter(f => f.value === e.type)[0].options}
				editable={this.props.editable}
				onChange={this.props.onChange}
			/>
		}
	}

}

class EvaluationDisplay extends Component {

	render() {
		const e = this.props.evaluation;
		const v = translateAssessment(e);
		return <Typography
			variant="h6"
			style={{ color: "white" }}
		>
			{v}
		</Typography>
	}

}



class EvaluationTab extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sortValue: "",
			sortDirection: "",
		}
	}

	onSortChange = (value) => {
		this.setState({
			sortValue: value,
			sortDirection: this.state.sortDirection === "desc" && this.state.sortValue === value ? "asc" : "desc"
		});
	}

	handleSingleChange = (newEv) => {
		let newEvaluations = this.props.evaluations.map((e) => {
			if (e.userId === newEv.userId) {
				return newEv;
			} else {
				return { ...e }
			}
		});
		this.props.handleChange(newEvaluations);
	}

	handleEvaluationTypeChange(newValue) {
		let newEvaluations = [];
		for (let i = 0; i < this.props.evaluations.length; i++) {
			newEvaluations.push({
				...this.props.evaluations[i],
				type: newValue,
			});
			this.props.handleChange(newEvaluations);
		}
	}

	sortEvaluations = () => {
		let evaluations = this.props.evaluations;
		const sortValue = this.state.sortValue;
		let sortDirection = this.state.sortDirection === "asc" ? "asc" : "desc";

		if (sortValue === "name") {
			evaluations.sort((a, b) => {
				let cmp = b.displayName < a.displayName;
				return sortDirection === "asc" ? cmp : -cmp;
			})
		} else if (sortValue === "evaluations") {
			evaluations.sort((a, b) => {
				a = a["assesment"];
				b = b["assesment"];
				let cmp = (b === null) - (a == null) || +(a > b) || -(a < b);
				return sortDirection === "asc" ? cmp : -cmp;
			})
		}
		return evaluations;
	}

	render() {
		let sortValue = this.state.sortValue;
		let sortDirection = this.state.sortDirection === "asc" ? "asc" : "desc";
		const style = {
			marginTop: "10px",
			alignItems: "center",
			paddingRight: "15px",
			paddingLeft: "15px",
			display: "flex",
		};
		const evaluations = this.props.evaluations;
		if (evaluations.length === 0) {
			return "Er zijn nog geen beoordelingen beschikbaar";
		}
		const evComps = this.sortEvaluations()
			.map(ev => {
				return (
					<Paper style={style} key={ev.userId} component="tr">
						<td style={{ flex: "1" }}>
							<Typography
								variant="h6"
								color="primary"
							>
								{ev.displayName}
							</Typography>
						</td>
						<EvaluationField
							editable={this.props.editable}
							evaluation={ev}
							onChange={(assesment) => this.handleSingleChange({ ...ev, assesment })}
						/>
						<InputField
							td
							label="Uitleg"
							name={ev.userId}
							value={ev.explanation}
							editable={this.props.editable}
							onChange={(explanation) => this.handleSingleChange({ ...ev, explanation })}
							multiline
							style={{ flex: "2" }}
						/>
					</Paper >
				);
			});

		return (
			<EnsureSecureLogin active={this.props.editable}>
				<table style={{ width: "100%" }}>
					<tbody>
						<Paper style={{ ...style, backgroundColor: "#e0e0e0" }} component="tr">
							<td style={{ paddingLeft: "15px" }}>
								<Typography type="title" color="primary" style={{ padding: "5px 0" }} >
									<Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
										<TableSortLabel
											active={sortValue === "evaluations"}
											onClick={() => this.onSortChange("evaluations")}
											direction={sortDirection}
											style={{ color: "inherit", fontSize: "1.5rem", }}
										>
											Beoordelingen
									</TableSortLabel>
									</Tooltip>
								</Typography>
								<div>
									<Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
										<TableSortLabel
											active={sortValue === "name"}
											onClick={() => this.onSortChange("name")}
											direction={sortDirection}
										>
											Naam
										</TableSortLabel>
									</Tooltip>
								</div>
							</td>
							<td style={{ flex: "5" }} />
							<td style={{ flex: "2" }} >
								<SelectField
									label="Beoordelingsformaat"
									value={evaluations[0].type}
									options={EVALUATION_FORMATS}
									editable={this.props.editable}
									onChange={this.handleEvaluationTypeChange.bind(this)}
								/>
							</td>
						</Paper >
						{evComps}
					</tbody>
				</table >
			</EnsureSecureLogin>
		);
	}

}

export {
	EvaluationDisplay,
	EvaluationField,
	EvaluationTab,
	getEvaluationColor,
	isCertificateWorthy,
	translateAssessment
};