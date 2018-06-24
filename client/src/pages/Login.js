import React from "react";
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

class Login extends Page {

	render() {
		return (
			<Paper className="Login" elevation={8}>
				<form onSubmit={this.props.handleLogin} style={{padding:"10px"}}>
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

export default Login;
