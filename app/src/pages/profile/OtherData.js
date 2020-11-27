import React, { Component } from "react";
import { Typography, Button, FormControlLabel, Checkbox } from "@material-ui/core/";
import { switchRole } from "../../store/actions"
import { connect } from 'react-redux';
import EnsureSecureLogin from "../../components/EnsureSecureLogin";
import SelectField from "../../fields/SelectField";

class OtherData extends Component {

	constructor(props) {
		super(props);
		this.state = {
			newRole: null,
		}
	}

	getRoleSwitchComponent = () => {
		const u = this.props.user;
		const roles = (u.availableRoles || "").split(",");
		if (roles.length === 1 || !this.props.isOwn) return null;
		return <div>
			<Typography variant="h6" color="secondary">
				Rolwissel
			</Typography>
			<EnsureSecureLogin>
				<table>
					<tbody>
						<tr>
							<Typography component="td">
								Huidige rol
							</Typography>
							<SelectField
								value={this.state.newRole || u.role}
								editable={this.props.editableUser}
								options={roles}
								onChange={newRole => this.setState({ newRole })}
								td
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
			</EnsureSecureLogin>
		</div>
	}

	getRequestProfileUpdateComponent = () => {
		const p = this.props;
		if (!p.isAdmin) return null;
		return <div>
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

	render() {
		return (
			<div>
				{this.getRoleSwitchComponent()}
				{this.getRequestProfileUpdateComponent()}
			</div>
		);
	}
}


export default connect()(OtherData);