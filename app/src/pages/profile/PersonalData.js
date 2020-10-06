import React, { Component } from "react";
import { Typography } from "@material-ui/core/";
import Field from "../../components/Field"
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
							<InputField
								value="Naam"
								td
								style={{ margin: "none" }}
							/>
							<InputField
								value={u.displayName}
								editable={p.editableAdmin}
								onChange={(value) => p.onChange("displayName", value)}
								td
							/>
						</tr>
						{p.isAdmin && <tr>
							<InputField
								value="Authenticatie email"
								td
							/>
							<InputField
								value={u.email}
								editable={p.editableAdmin}
								onChange={(value) => p.onChange("email", value)}
								td
							/>
						</tr>}
						<tr>
							<InputField
								value="Voorkeursemail"
								td
							/>
							<InputField
								validate={{ type: "email" }}
								value={u.preferedEmail}
								editable={p.editableUser}
								onChange={(value) => p.onChange("preferedEmail", value)}
								td
							/>
						</tr>
						<tr>
							<InputField
								value="Telefoonnummer"
								td
							/>
							<InputField
								validate={{ type: "phoneNumber" }}
								value={"06 " + (u.phoneNumber ? u.phoneNumber.replace(/^06[ ]*/, "") : "")}
								td
								editable={p.editableUser}
								onChange={(value) => p.onChange("phoneNumber", value.slice(0, 11))}
							/>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}


export default PersonalData;