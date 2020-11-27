import React, { Component } from 'react';
import { Typography, Divider } from '@material-ui/core/';
import { cloneDeep } from "lodash";
import possibleValues from "./educationConstraints"
import SelectField from '../../fields/SelectField';

class EducationData extends Component {

	reducedChoices = null;
	reduceChoices = () => {
		let autoFilledUser = { ...this.props.user };
		let CONS = cloneDeep(possibleValues);
		for (let i = 0; i < 5; i++) {
			for (let field in possibleValues) {
				let userValue = CONS[field][autoFilledUser[field]];
				if (userValue != null) {
					for (let constraint in userValue) {
						CONS[constraint] = this.intersection(CONS[constraint], userValue[constraint]);
					}
				}
			}
			for (let field in possibleValues) {
				if (Object.keys(CONS[field]).length === 1) {
					autoFilledUser[field] = Object.keys(CONS[field])[0];
				}
			}
		}
		this.reducedChoices = CONS;
	}

	intersection = (o1, o2) => {
		return Object.keys(o1)
			.concat(Object.keys(o2))
			.sort()
			.reduce(function (r, a, i, aa) {
				if (i && aa[i - 1] === a) {
					return {
						...r,
						[a]: o1[a]
					}
				}
				return r;
			}, {});
	}

	getField = (field) => {
		let value = this.props.user[field];
		let options = Object.keys(this.reducedChoices[field]);
		let editable = this.props.editableUser;
		if (options == null || options.length === 0) {
			console.error(this.props.user);
			console.error("INVALID EDUCATION DATA STATE ON FIELD " + field);
			options = Object.keys(possibleValues[field]);
		}
		if (options.length === 1) {
			value = options[0];
			editable = false;
		}
		if (options.indexOf(value) === -1) {
			value = "";
		}
		if (field === "school") {
			editable = this.props.editableAdmin;
		}
		return <SelectField
			value={value}
			editable={editable}
			onChange={(v) => this.props.onChange(field, v)}
			td
			validate={{
				notEmpty: true,
			}}
			options={options}
		/>
	}

	render() {
		const p = this.props;
		this.reduceChoices();
		return (
			<div>
				<Typography variant="h6" color="secondary">
					Schoolgegevens
				</Typography>
				<table>
					<tbody>
						<tr>
							<Typography component="td">
								School
							</Typography>
							{this.getField("school")}
						</tr>
						<tr>
							<Typography component="td">
								Rollen
							</Typography>
							<SelectField
								value={(p.user.availableRoles || "").split(",")}
								multiple
								editable={p.editableAdmin}
								td
								options={["admin", "student", "teacher", "grade_admin"]}
								onChange={(v) => p.onChange("availableRoles", v.join(","))}
							/>
						</tr>
					</tbody>
				</table>
				<Divider />
				<table>
					<tbody>
						<tr>
							<Typography component="td">
								Opleidingsniveau
							</Typography>
							{this.getField("level")}
						</tr>
						<tr>
							<Typography component="td">
								Schoollocatie
							</Typography>
							{this.getField("schoolLocation")}
						</tr>
						<tr>
							<Typography component="td">
								Leerjaar
							</Typography>
							{this.getField("year")}
						</tr>
						<tr>
							<Typography component="td">
								Profiel
							</Typography>
							{this.getField("profile")}
						</tr>
						<tr>
							<Typography component="td">
								Extra toetsrechten
							</Typography>
							<SelectField
								value={this.props.user["examRights"] ? this.props.user["examRights"].split(",") : []}
								td
								editable={this.props.editableUser}
								onChange={(v) => this.props.onChange("examRights", v.join(","))}
								multiple
								options={[
									"Toetstijdverlenging",
									"Gesproken toetsen",
									"Gebruik van laptop",
									"Gebruik van woordenboek",
									"Geen extra rechten",
								]}
							/>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default EducationData;