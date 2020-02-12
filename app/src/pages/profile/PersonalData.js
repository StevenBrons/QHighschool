import React, { Component } from "react";
import { Typography } from "@material-ui/core/";
import Field from "../../components/Field"

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
							<Field
								value="Naam"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={u.displayName}
								style={{ margin: "none" }}
								editable={p.editableAdmin}
								onChange={(value) => p.onChange("displayName", value)}
								layout={{ td: true, area: true }}
							/>
						</tr>
						<tr>
							<Field
								value="Voorkeursemail"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								validate={{ type: "email" }}
								value={u.preferedEmail}
								style={{ margin: "none" }}
								editable={p.editableUser}
								onChange={(value) => p.onChange("preferedEmail", value)}
								layout={{ td: true }}
							/>
						</tr>
						<tr>
							<Field
								value="Telefoonnummer"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								validate={{ type: "phoneNumber" }}
								value={"06 " + (u.phoneNumber ? u.phoneNumber.replace(/^06[ ]*/, "") : "")}
								layout={{ td: true }}
								style={{ margin: "none" }}
								editable={p.editableUser}
								onChange={(value) => p.onChange("phoneNumber", value)}
							/>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}


export default PersonalData;