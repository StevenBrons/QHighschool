import React from 'react';
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { User } from "../Data";
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

const profiles = ["NT", "NG", "CM", "EM", "NT&NG", "EM&CM"];

class Settings extends Page {

	constructor(props) {
		super(props);
		this.state = {
			user: {

			},
			old: {

			},
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
			this.setState({ user: data, old: data });
		});
	}

	handleChange = name => event => {
		const val = event.target.value;
		this.setState(prevState => ({
			user: {
				...prevState.user,
				[name]: val,
			}
		}))
	};

	hasChanged() {
		return JSON.stringify(this.state.old) !== JSON.stringify(this.state.user)
	}

	save() {
		User.setUser({
			preferedEmail: this.state.user.preferedEmail,
			phoneNumber: this.state.user.phoneNumber,
			profile: this.state.user.profile,
		}).then(() => {return User.getUser()}).then(data => {
			this.props.onSave(data);
			this.setState({
				old: data,
			});
		});
	}

	render() {

		let inputStyle = {
			display: "inline-block",
			width: "45%",
			margin: "20px",
		}
		const user = this.state.user;
		return (
			<Paper style={this.state.style} elevation={0} className="Page">
				<Typography variant="headline" color="primary">
					{"Instellingen"}
				</Typography>
				<form noValidate autoComplete="off">
					<TextField
						id="firstname"
						label="Voornaam"
						value={user.firstName + ""}
						onChange={this.handleChange('firstname')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="lastName"
						label="Achternaam"
						value={user.lastName + ""}
						onChange={this.handleChange('lastName')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="role"
						label="Rol"
						value={user.role + ""}
						onChange={this.handleChange('role')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="year"
						label="Leerjaar"
						value={user.year + ""}
						onChange={this.handleChange('year')}
						margin="normal"
						disabled
						fullWidth
						style={inputStyle}
					/>
					<TextField
						id="level"
						label="Niveau"
						value={user.level + ""}
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
						value={user.preferedEmail + ""}
						onChange={this.handleChange('preferedEmail')}
						margin="normal"
						fullWidth
						style={inputStyle}
					/>
					<Select
						id="profile"
						label="Profiel"
						select
						value={user.profile}
						onChange={this.handleChange('profile')}
						margin="normal"
						fullWidth
						style={inputStyle}
					>
						{profiles.map(profile => {
							return (<MenuItem key={profile} value={profile}>
								{profile}
							</MenuItem>
						)})}
					</Select>
					<TextField
						id="phoneNumber"
						label="Telefoon nummer"
						value={user.phoneNumber + ""}
						onChange={this.handleChange('phoneNumber')}
						margin="normal"
						fullWidth
						style={inputStyle}
					/>
					<br />
					{this.hasChanged() ?
						<Button variant="contained" color="secondary" size="large" onClick={this.save.bind(this)}>
							Opslaan
						</Button> : null
					}

				</form >
			</Paper>
		);
	}
}

export default Settings;

