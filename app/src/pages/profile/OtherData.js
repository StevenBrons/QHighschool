import React, { Component } from "react";
import { Typography, Button, FormControlLabel, Checkbox } from "@material-ui/core/";
import Field from "../../components/Field"
import { switchRole } from "../../store/actions"
import { connect } from 'react-redux';

class OtherData extends Component {

	constructor(props) {
		super(props);
		this.state = {
			newRole: null, 
		}
	}

	render() {
		const p = this.props;
		const u = p.user;
		return (
			<div>
				<Typography variant="h6" color="secondary">
					Overig
				</Typography>
				{(u.availableRoles.split(",").length > 1) &&
				<table>
					<tbody>
						<tr>
							<Field
								value="Huidige rol"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={this.state.newRole || u.role}
								style={{ margin: "none" }}
								editable={p.editableUser}
								options={u.availableRoles.split(",")}
								onChange={newRole => this.setState({newRole})}
								layout={{ td: true, area: true }}
							/>
							<Button
								variant="contained"
								color="primary"
								disabled={this.state.newRole == null}
								component="td"
								onClick={() => this.props.dispatch(switchRole(this.state.newRole))}>
								Verander rol
							</Button>
						</tr>
					</tbody>
				</table>
				}
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
							label="Deze gebruiker moet zijn gegevens bijwerken"
						/>
					</div>
				}
			</div>
		);
	}
}


export default connect()(OtherData);