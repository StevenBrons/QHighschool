import React, { Component } from "react";
import { Typography, Divider } from "@material-ui/core/";
import Field from "../../components/Field"

class PersonalData extends Component {

	render() {
		const p = this.props;
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
								value={p.displayName}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
							/>
						</tr>
						<tr>
							<Field
								value="Voorkeurs email"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								validate={{ type: "email" }}
								value={p.preferedEmail}
								style={{ margin: "none" }}
								editable
								onChange={(value) => p.onChange("preferedEmail", value)}
								layout={{ td: true, area: true }}
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
								value={"06 " + (p.phoneNumber ? p.phoneNumber.replace(/^06[ ]*/, "") : "")}
								layout={{ td: true, area: true }}
								style={{ margin: "none" }}
								onChange={(value) => p.onChange("phoneNumber", value)}
								editable
							/>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}


export default PersonalData;