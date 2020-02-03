import React, { Component } from "react";
import { Typography } from "@material-ui/core/";
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
			</div>
		);
	}
}


export default Remarks;