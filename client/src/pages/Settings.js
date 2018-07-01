import React from 'react';
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { setUser } from '../store/actions';

const profiles = ["NT", "NG", "CM", "EM", "NT&NG", "EM&CM"];

class Settings extends Page {

	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user,
			style: {
			},
		};
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
		return JSON.stringify(this.props.user) !== JSON.stringify(this.state.user)
	}

	render() {
		let inputStyle = {
			display: "inline-block",
			width: "45%",
			margin: "20px",
		}
		const user = this.state.user;
		return (
			<div className="Page" style={this.state.style}>
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
					<TextField
						id="profile"
						label="Profiel"
						select
						value={this.state.user.profile}
						onChange={this.handleChange('profile')}
						margin="normal"
						fullWidth
						style={inputStyle}
					>
						{profiles.map(profile => {
							return (<MenuItem key={profile} value={profile}>
								{profile}
							</MenuItem>
							)
						})}
					</TextField>
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
						<Button variant="contained" color="secondary" size="large" onClick={() => this.props.save(this.state.user)}>
							Opslaan
						</Button> : null
					}
				</form >
			</div>
		);
	}
}

function mapStateToProps(state) {
	if (state.userId == null) {
		return {
			user: {},
		}
	}
	return {
		user: state.users[state.userId],
		key: state.userId,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		save: (user) => dispatch(setUser(user)),
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(Settings);

