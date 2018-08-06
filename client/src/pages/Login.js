import React from "react";
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { toggleMenu } from '../store/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Login extends Page {

	handleChange = name => event => {
		this.setState(prevState => ({
			...prevState,
			[name]: event.target.value,
		}))
	};

	handleLogin(event) {
		event.preventDefault();
		this.props.login(event.target[0].value, event.target[1].value);
		document.location.reload();
	}

	render() {
		if (this.props.userId != null) {
			this.props.history.push("/");
			this.props.toggleMenu(true);
		} else {
			this.props.toggleMenu(false);
		}
		return (
			<Paper className="Login" elevation={8}>
				<form onSubmit={this.handleLogin.bind(this)} style={{ padding: "10px" }}>
					<TextField
						name="email"
						id="email"
						label="Gebruikersnaam"
						margin="normal"
						fullWidth
					/>
					<br />
					<TextField
						name="password"
						id="password"
						label="Wachtwoord"
						margin="normal"
						type="password"
						fullWidth
					/>
					<br />
					<Button type="submit" variant="contained" color="primary">
						Login
					</Button>
				</form>
			</Paper>
		);
	}
}


function mapStateToProps(state) {
	return {
		userId: state.userId,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		login: (email, password) => {
			dispatch(toggleMenu(true));
		},
		toggleMenu: (state) => {
			dispatch(toggleMenu(state));
		},
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));



