import React from "react";
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { toggleMenu } from '../store/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setCookie } from "../lib/Cookie";

class Login extends Page {

	componentWillMount() {
		if (this.props.token != null) {
			this.props.history.push("/");
		} else {
			this.props.toggleMenu(false);
		}
	}


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
		token: state.token,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		login: (email, password) => {
			let token = "student";
			if (email === "teacher") {
				token = "teacher";
			}
			setCookie("token", token);
			dispatch(toggleMenu(true));
			dispatch({
				type: "SET_TOKEN",
				token: token,
			})
		},
		toggleMenu: (state) => {
			dispatch(toggleMenu(state));
		},

	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));



