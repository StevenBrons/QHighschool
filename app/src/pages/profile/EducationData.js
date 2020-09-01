import React, { Component } from 'react';
import { Typography, Divider } from '@material-ui/core/';
import Field from '../../components/Field';
import { cloneDeep } from "lodash";
import possibleValues from "./educationConstraints"

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
				width: "50%"
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
								value="Rollen"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.user.availableRoles.split(",")}
								style={{ margin: "none", width: "50%" }}
								multiple
								editable={p.editableAdmin}
								layout={{ td: true, area: true }}
								options={["admin","student","teacher","grade_admin"]}
								onChange={(v) => p.onChange("availableRoles", v.join(","))}
							/>
						</tr>
						<tr>
							<Field
								value="Schoolemail"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.user.email}
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
								value="Schoollocatie"
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