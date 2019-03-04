import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { setCookie } from "../store/actions"
import Field from "../components/Field"

class EnsureSecureLogin extends Component {

	render() {
		if (!(this.props.active === false) && this.props.secureLogin == null) {
			return <Paper style={{ padding: "20px",marginTop:"25px" }}>
				<Field value="Log opnieuw in om de beoordelingen te bewerken" layout={{ area: true }} />
				<Button color="primary" variant="contained" onClick={() => {
					setCookie("beforeLoginPath", window.location.pathname + window.location.search, 24);
					document.location.href = "/auth/login?secure=true";
				}}>
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



