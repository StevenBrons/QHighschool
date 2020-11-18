import React, { Component } from "react";
import { Typography } from "@material-ui/core/";
import { Alert } from "@material-ui/lab";
import { validate } from "../../fields/FieldContainer"
import InputField from "../../fields/InputField";

class PersonalData extends Component {

	render() {
		const p = this.props;
		const u = p.user;
		return (
			<div>
				<Typography variant="h6" color="secondary">
					Persoonlijke gegevens
				</Typography>
				<table>
					<tbody>
						<tr>
							<Typography component="td">
								Naam
							</Typography>
							<InputField
								value={u.displayName}
								editable={p.editableAdmin}
								onChange={(value) => p.onChange("displayName", value)}
								td
							/>
						</tr>
						{p.isAdmin && <tr>
							<Typography component="td">
								Authenticatie email
							</Typography>
							<InputField
								value={u.email}
								editable={p.editableAdmin}
								onChange={(value) => p.onChange("email", value)}
								td
							/>
						</tr>}
						<tr>
							<Typography component="td">
								Voorkeursemail
							</Typography>
							<InputField
								validate={{ type: "email" }}
								value={u.preferedEmail}
								editable={p.editableUser}
								onChange={(value) => p.onChange("preferedEmail", value)}
								td
							/>
							<td>
								{!validate(u.preferedEmail, { type: "email" }) &&
									<Alert severity="warning">
										Als je geen ander email invult, gaan onze berichten naar je school e-mailadres!
									</Alert>
								}
							</td>
						</tr>
						<tr>
							<Typography component="td">
								Mobiel nummer
							</Typography>
							<InputField
								validate={{ type: "phoneNumber" }}
								value={"06 " + (u.phoneNumber ? u.phoneNumber.replace(/^06[ ]*/, "") : "")}
								td
								editable={p.editableUser}
								onChange={(value) => p.onChange("phoneNumber", value.slice(0, 11))}
							/>
							<td>
								{!validate(u.phoneNumber, { type: "phoneNumber" }) &&
									<Alert severity="warning">
										Zonder mobiele nummer kunnen we je niet snel bereiken!
									</Alert>
								}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}


export default PersonalData;