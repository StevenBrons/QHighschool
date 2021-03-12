import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const CARD_STYLE = {
	width: "300px",
	height: "80px",
	padding: "20px",
	verticalAlign: "top",
	margin: "20px",
	display: "inline-block",
	cursor: "pointer",
}

class GroupCard extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hover: false,
			style: {
				...CARD_STYLE,
				...this.props.style,
			}
		}
	}

	expand() {
		this.props.history.push("/gebruiker/" + this.props.user.id)
	}

	render() {
		const user = this.props.user;
		return (
			<Paper
				elevation={this.state.hover ? 4 : 2}
				onMouseEnter={() => this.setState({ hover: true })}
				onMouseLeave={() => this.setState({ hover: false })}
				style={this.state.style}
			>
				<Typography variant="button" color={user.role === "teacher" ? "secondary" : "primary"} >
					{user.firstName + " " + user.lastName}
				</Typography>
				<Typography variant="subtitle1">
					{(user.role === "teacher" ? "docent" : "leerling") + "\t" + user.school}
				</Typography>
			</Paper >
		);
	}


}


export default withRouter(GroupCard);

