import React from 'react';
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { User } from "../Data";
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

class Settings extends Page {

	constructor(props) {
		super(props);
		this.state = {
			style: {
				width: "95%",
				height: "auto",
				padding: "20px",
				margin: "20px",
				display: "inline-block",
			},
		};
	}

	componentWillMount() {
		User.getUser().then((data) => {
			this.setState(data);
		});
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {

		let inputStyle = {
			display: "inline-block",
			width: "45%",
			margin:"20px",
		}

		return (
			<Paper style={this.state.style} elevation={0} className="Page">
				<form noValidate autoComplete="off">
					<TextField
						id="firstname"
						label="Voornaam"
						value={this.state.firstName + ""}
						onChange={this.handleChange('firstname')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="lastName"
						label="Achternaam"
						value={this.state.lastName + ""}
						onChange={this.handleChange('lastName')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="role"
						label="Rol"
						value={this.state.role + ""}
						onChange={this.handleChange('role')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="year"
						label="Leerjaar"
						value={this.state.year + ""}
						onChange={this.handleChange('year')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="level"
						label="Niveau"
						value={this.state.level + ""}
						onChange={this.handleChange('level')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<Divider />
					<TextField
						id="preferedEmail"
						label="Voorkeurs email"
						value={this.state.preferedEmail + ""}
						onChange={this.handleChange('preferedEmail')}
						margin="normal"
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="profile"
						label="Profiel"
						value={this.state.profile + ""}
						onChange={this.handleChange('profile')}
						margin="normal"
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="phoneNumber"
						label="Telefoon nummer"
						value={this.state.phoneNumber + ""}
						onChange={this.handleChange('phoneNumber')}
						margin="normal"
						fullWidth
						style={inputStyle}
					/>
				</form >
			</Paper>
		);
	}
}

export default Settings;

