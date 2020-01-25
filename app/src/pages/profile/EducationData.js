import React, { Component } from 'react';
import { Typography, Divider } from '@material-ui/core/';
import Field from '../../components/Field';
import { cloneDeep } from "lodash";
import possibleValues, { arrToObj } from "./educationConstraints"

class EducationData extends Component {

	constructor(props) {
		super(props);
	}

	reduceChoices = (field) => {
		let CONS = cloneDeep(possibleValues);
		for (let field in possibleValues) {
			let userValue = CONS[field][this.props[field]];
			if (userValue != null) {
				console.log(userValue);
				console.log(CONS[field]);
				CONS[field] = this.intersection(CONS[field], userValue);
			}
		}
		return Object.keys(CONS[field]);
		// Fill missing values in constraints matrix
	}

	intersection = (o1, o2) => {
		return Object.keys(o1).concat(Object.keys(o2)).sort().reduce(function (r, a, i, aa) {
			if (i && aa[i - 1] === a) {
				return {
					...r,
					[a]: o1[a]
				}
			}
			return r;
		}, {});
	}

	normalizeRole = (role) => {
		switch (role) {
			case "student":
				return "leerling";
			case "teacher":
				return "expert";
			case "grade_admin":
				return "contactpersoon";
			case "admin":
				return "administrator";
			default:
				return "onbekend";
		}
	}

	getField = (field) => {
		let value = this.props[field];
		let options = this.reduceChoices(field);
		let editable = true;
		if (options.length === 1) {
			value = options[0];
			editable = false;
		}
		if (options.length === 0) {
			console.error("INVALID EDUCATION DATA STATE ON FIELD " + field);
			options = Object.keys(possibleValues[field]);
		}
		return <Field
			value={value}
			editable={editable}
			onChange={(value) => this.props.onChange(field, value)}
			layout={{
				td: true,
				area: true,
			}}
			validate={{
				notEmpty: true,
			}}
			style={{
				margin: "none",
			}}
			options={options}
		/>
	}

	render() {
		const p = this.props;
		return (
			<div>
				<Typography variant="h6" color="secondary">
					School gegevens
				</Typography>
				<table>
					<tbody>
						<tr>
							<Field
								value="School"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							{this.getField("school")}
						</tr>
						<tr>
							<Field
								value="Hoofdrol"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={this.normalizeRole(p.role)}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
							/>
						</tr>
						<tr>
							<Field
								value="School email"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.email}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
							/>
						</tr>
					</tbody>
				</table>
				<Divider />
				<table>
					<tbody>
						<tr>
							<Field
								value="Opleidingsniveau"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							{this.getField("level")}
						</tr>
						<tr>
							<Field
								value="School locatie"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							{this.getField("schoolLocation")}
						</tr>
						<tr>
							<Field
								value="Leerjaar"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							{this.getField("year")}
						</tr>
						<tr>
							<Field
								value={"Profiel"}
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							{this.getField("profile")}
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default EducationData;