import React, { Component } from "react";
import { Typography, Checkbox, FormControlLabel } from "@material-ui/core/";

class Remarks extends Component {

	render() {
		const p = this.props;
		return (
			<div>
				{/* <Typography variant="h6" color="secondary">
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
				/> */}
				{p.isAdmin &&
					<div>
						<Typography variant="h6" color="secondary">
							Verzoek profiel update
						</Typography>
						<FormControlLabel
							control={
								<Checkbox
									checked={p.user.needsProfileUpdate}
									disabled={!p.editableUser}
									color="primary"
									onChange={({ target: { checked } }) => p.onChange("needsProfileUpdate", checked)}
								/>
							}
							label="Deze leerling moet zijn gegevens bijwerken"
						/>
					</div>
				}
			</div>
		);
	}
}


export default Remarks;