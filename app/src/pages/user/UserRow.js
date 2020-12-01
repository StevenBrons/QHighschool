import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import { Link, Typography } from '@material-ui/core';
import { connect } from "react-redux";

class UserRow extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hover: false,
			style: {
				width: "100%",
				height: "auto",
				margin: "0px",
				padding: "10px",
			},
		}
	}

	formatPhoneNumber(number) {
		if (number == null) {
			number = "";
		}
		let numberWithoutCharacters = number.replace(/\D/g, '');
		if (numberWithoutCharacters.length === 10) { // Either 06... or regional i.e. 024 ...
			if (numberWithoutCharacters[1] === "6") { // 06...
				return (numberWithoutCharacters.substr(0, 2) + " " + numberWithoutCharacters.substr(2, 8));
			} else { // 024 ...
				return (numberWithoutCharacters.substr(0, 3) + " " + numberWithoutCharacters.substr(3, 7));
			}
		}
		const mobileTest = /(0031|31)0?(6)?([0-9]+)$/gm;
		const match = mobileTest.exec(numberWithoutCharacters);
		if (match) {
			if (match[2]) { // +31 06 
				return "+31 06 " + match[3];
			} else { // +31 ...
				return "+31 " + match[3];
			}
		} else {
			return number; // return input if unrecognizable 
		}
	}

	render() {
		let user = { ...this.props.user };
		let style = { ...this.state.style };
		let isExtendedUser = user.preferedEmail || user.phoneNumber || user.email;

		return (
			<tr key={user.id}>
				<Paper
					elevation={this.state.hover ? 2 : 1}
					onMouseEnter={() => this.setState({ hover: true })}
					onMouseLeave={() => this.setState({ hover: false })}
					component="td"
					style={style}
				>
					<div style={{
						display: "flex",
						justifyContent: "space-between"
					}}>
						<Typography variant="button" color={user.role === "teacher" ? "secondary" : "primary"} style={{ flex: 1 }} >
							<Link href={`/gebruiker/${user.id}`} onClick={(e) => {
								e.preventDefault();
								this.props.history.push(`/gebruiker/${user.id}`);
							}}>
								{user.displayName}
							</Link>
						</Typography>
						<Typography variant="subtitle1" style={{ flex: 1 }} >
							{user.school}
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
							{user.role}
						</Typography>
						<Typography variant="body1" style={{ flex: 1 }} >
							{user.id}
						</Typography>
					</div>
					{isExtendedUser ?
						<div style={{
							display: "flex",
							justifyContent: "space-between"
						}}>
							<Typography variant="body1" style={{ flex: 1 }} >
								{user.preferedEmail}
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
								{user.level + " - " + user.year}
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
								{user.profile}
							</Typography>
							<Typography variant="body1" style={{ flex: 1 }} >
								{this.formatPhoneNumber(user.phoneNumber)}
							</Typography>
						</div> : null
					}
					{this.props.children}
				</Paper >
			</tr>
		);
	}
}

function mapStateToProps(state, { userId, children }) {
	return {
		role: state.role,
		user: state.users[userId],
		userId,
		children,
	};
}

function mapDispatchToProps(dispatch) {
	return {
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserRow));

