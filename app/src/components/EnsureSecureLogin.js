import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { relogSecure } from "../store/actions"
import Field from "./Field"

class EnsureSecureLogin extends Component {

	render() {

		if (!(this.props.active === false) && this.props.secureLogin == null) {
			const content = <div>
				<Field value="Log opnieuw in om toegang te krijgen" layout={{ area: true }} style={{ width: "auto" }} />
				<Button color="primary" variant="contained" onClick={relogSecure}>
					Inloggen
				</Button>
			</div>
			if (this.props.dense) {
				return content;
			} else {
				return <Paper style={{ padding: "20px", marginTop: "25px" }}>
					{content}
				</Paper>
			}
		} else {
			return this.props.children;
		}
	}
}

function mapStateToProps(state) {
	return {
		secureLogin: state.secureLogin,
	};
}

export default connect(mapStateToProps, null)(EnsureSecureLogin);



