import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { relogSecure } from "../store/actions"
import Field from "../components/Field"

class EnsureSecureLogin extends Component {

	render() {
		if (!(this.props.active === false) && this.props.secureLogin == null) {
			return <Paper style={{ padding: "20px", marginTop: "25px" }}>
				<Field value="Log opnieuw in om toegang te krijgen" layout={{ area: true }} />
				<Button color="primary" variant="contained" onClick={relogSecure}>
					Inloggen
				</Button>
			</Paper>
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



