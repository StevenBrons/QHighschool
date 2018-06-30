import React, { Component } from "react";
import { connect } from "react-redux";

import UserRow from "../components/UserRow";

import { withRouter } from 'react-router-dom';
import Progress from '../components/Progress'

class User extends Component {

	render() {
		if (this.props.user == null) {
			if (this.props.display === "Page") {
				if (this.props.notExists) {
					return (
						<div className="Page">
							De opgevraagde user bestaat niet
						</div>
					);
				} else {
					this.props.getUser(this.props.userId)
					return (
						<div className="Page">
							<Progress />
						</div>
					);
				}
			} else {
				return this.props.notExists ? null : <Progress />;
			}
		}


		switch (this.props.display) {
			case "page":
				return (
					<UserRow {...this.props} />
				);
			case "row":
				return (
					<UserRow {...this.props} />
				);
			case "card":
			default:
				return (
					<UserRow {...this.props} />
				);
		}
	}
}


function mapStateToProps(state, ownProps) {
	let id = ownProps.match.params.userId || ownProps.userId;
	let display = ownProps.display || "Page";

	let notExists = false;
	let user = null;
	console.log(id);
	console.log(state.users[id]);

	if (state.users == null || state.users[id] == null) {
		if (id == null || state.hasFetched.includes("User.get(" + id + ")")) {
			notExists = true;
		}
	} else {
		user = state.users[id];
	}

	return {
		user,
		notExists,
		display,
		userId: id,
	}
}

export default withRouter(connect(mapStateToProps)(User));
