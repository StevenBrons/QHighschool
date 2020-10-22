import React, { Component } from "react";
import { connect } from "react-redux";

import UserRow from "./UserRow";
import UserCard from "./UserCard";
import { setSecureLogin } from "../../store/actions"

import { withRouter } from 'react-router-dom';
import Progress from '../../components/Progress'
import { Button, Typography } from "@material-ui/core";

class User extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (this.props.user == null) {
			if (this.props.display === "page") {
				if (this.props.notExists) {
					return (
						<div className="page">
							De opgevraagde gebruiker bestaat niet
						</div>
					);
				} else {
					return (
						<div className="page">
							<Progress />
						</div>
					);
				}
			} else {
				if (this.props.notExists) {
					return null;
				} else {
					return <Progress />;
				}
			}
		}

		switch (this.props.display) {
			case "name":
				return <Typography component="td" color="primary" variant="button">
					{this.props.user.displayName}
				</Typography>;
			case "row":
				return (
					<UserRow {...this.props}>
						{
							this.props.actions &&
							this.props.actions.map(action => {
								return (
									<Button onClick={() => action.onClick(this.props.userId)} variant="contained" color="primary" style={{ marginRight: "10px" }} >
										{action.label}
									</Button>
								)
							})
						}
					</UserRow>
				);
			case "card":
			default:
				return (
					<UserCard {...this.props} />
				);
		}
	}
}


function mapStateToProps(state, ownProps) {
	let id = ownProps.match.params.userId || ownProps.userId;
	let display = ownProps.display || "page";

	let notExists = false;
	let user = null;

	if (id == null) {
		id = state.userId;
	}

	if (state.users == null || state.users[id] == null) {
		if (id == null || state.hasFetched.indexOf("User.get(" + id + ")") !== -1) {
			notExists = true;
		}
	} else {
		user = state.users[id];
	}

	return {
		role: state.role,
		user,
		notExists,
		display,
		userId: id,
		ownProfile: ("" + id) === ("" + state.userId),
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setSecureLogin: (secureLogin) => dispatch(setSecureLogin(secureLogin)),
	};
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User));
