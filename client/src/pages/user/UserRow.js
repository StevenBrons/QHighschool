import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class GroupCard extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hover: false,
			style: {
				width: "100%",
				height: "auto",
				margin: "0px",
				marginTop: "10px",
				marginBottom: "10px",
				padding: "10px",
			},
		}
	}

	expand() {
		this.props.history.push("/user/" + this.props.user.id)
	}

	render() {
		let user = {...this.props.user};
		if (this.props.header) {
			user.firstName = "Naam";
			user.lastName = "";
			user.school = "School";
			user.level = "Niveau";
			user.role = "Rol";
			user.profile = "Profiel";
			user.email = "Office Email";
			user.preferedEmail = "Voorkeurs email";
			user.year = "Leerjaar";
			user.phoneNumber = "Telefoonnummer";
			user.id = "Gebruikers ID";
		}
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<div style={{
					display: "flex",
					justifyContent: "space-between"
				}}>
					<Typography variant="title" color={user.role === "teacher" ? "secondary" : "primary"} style={{ flex: 1 }}>
						{user.firstName + " " + user.lastName}
					</Typography>
					<Typography variant="subheading" style={{ flex: 1 }}>
						{user.school}
					</Typography>
					<Typography variant="body1" style={{ flex: 1 }}>
						{user.level + " - " + user.year}
					</Typography>
					<Typography variant="body1" style={{ flex: 1 }}>
						{user.role === "teacher" ? "docent" : "leerling"}
					</Typography>
					<Typography variant="body1" style={{ flex: 1 }}>
						{user.profile}
					</Typography>
				</div>
				{this.props.role === "admin" &&
					<div style={{
						display: "flex",
						justifyContent: "space-between"
					}}>
						<Typography variant="body1" style={{ flex: 1 }}>
							{user.email}
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }}>
							{user.preferedEmail}
						</Typography>
						<div style={{ flex : 1}}>
						</div>
						<Typography variant="body1" style={{ flex: 1 }}>
							{user.phoneNumber}
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }}>
							{user.id}
						</Typography>
					</div>
				}
			</Paper >
		);
	}


}


export default withRouter(GroupCard);

