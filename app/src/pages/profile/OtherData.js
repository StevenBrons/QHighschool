import React, { Component } from "react";
import { Typography, Button } from "@material-ui/core/";
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
		if (u.availableRoles.split(",").length <= 1) {
			return null;
		}
		return (
			<div>
				<Typography variant="h6" color="secondary">
					Overig
				</Typography>
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
			</div>
		);
	}
}


export default connect()(OtherData);