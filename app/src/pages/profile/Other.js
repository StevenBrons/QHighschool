import React, { Component } from "react";
import { Typography, Checkbox, FormControlLabel } from "@material-ui/core/";
import Field from "../../components/Field"

class Remarks extends Component {

	render() {
		const p = this.props;
		return (
			<div>
				<Typography variant="h6" color="secondary">
					Opmerkingen
				</Typography>
				{!p.isStudent &&
					<Typography>
						Let op: Dit veld is ook voor leerlingen zichtbaar!
					</Typography>
				}
				<Field
					value={p.user.remarks}
					style={{ minHeight: "200px" }}
					layout={{ area: true }}
					editable={p.isAdmin}
					onChange={(value) => p.onChange("remarks", value)}
				/>
				<Typography variant="h6" color="secondary">
					Verzoek profiel update
				</Typography>
				<FormControlLabel
					control={
						<Checkbox
							checked={p.user.needsProfileUpdate}
							color="primary"
							onChange={({ target: { checked } }) => p.onChange("needsProfileUpdate", checked)}
						/>
					}
					label="Deze leerling moet zijn gegevens bijwerken"
				/>

			</div>
		);
	}
}


export default Remarks;