import React, { Component } from 'react';

import Field from '../../components/Field';
import EnsureSecureLogin from '../../components/EnsureSecureLogin';
import { Tooltip, TableSortLabel, Typography, Paper } from '@material-ui/core';

const EVALUATION_FORMATS = [{
	label: "vink",
	value: "check",
	options: [{
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
	}],
},
{
	label: "trapsgewijs",
	value: "stepwise",
	options: [{
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
	}],
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

class Evaluation extends Component {

	render() {
		const e = this.props.evaluation;
		let style = {
			underline: false,
			flex: 1,
		};
		let layout = { td: true };
		if (this.props.student) {
			style.type = "headline";
			style.color = "primaryContrast"
			layout.td = false;
			layout.alignment = "right";
		}
		if (e.type === "decimal") {
			return <Field
				style={style}
				validate={{ min: 1, max: 10, type: "decimalGrade", notEmpty: true }}
				layout={layout}
				label="Beoordeling"
				name={e.userId}
				value={e.assesment ? e.assesment : ""}
				editable={this.props.editable}
				onChange={this.props.onChange}
			/>
		} else {
			return <Field
				style={style}
				name={e.userId}
				label="Beoordeling"
				layout={layout}
				value={e.assesment ? e.assesment : ""}
				options={EVALUATION_FORMATS.filter(f => f.value === e.type)[0].options}
				editable={this.props.editable}
				onChange={this.props.onChange}
			/>
		}
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
						<Field style={{ type: "title", color: "primary", flex: 2 }} value={ev.displayName} layout={{ td: true }} />
						<Evaluation
							editable={this.props.editable}
							evaluation={ev}
							onChange={(assesment) => this.handleSingleChange({ ...ev, assesment })}
						/>
						<Field
							style={{ underline: false, flex: 5 }}
							layout={{ area: true, td: true }}
							label={"Uitleg"}
							name={ev.userId}
							value={ev.explanation}
							editable={this.props.editable}
							onChange={(explanation) => this.handleSingleChange({ ...ev, explanation })}
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
							<td>
								<Field
									label="Beoordelingsformaat"
									style={{ type: "caption", underline: false, margin: "normal", labelVisible: true }}
									layout={{ alignment: "right" }}
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

export { Evaluation, EvaluationTab, getEvaluationColor };