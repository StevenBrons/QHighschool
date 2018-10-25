import React, { Component } from "react";
import { connect } from "react-redux";

import UserRow from "./UserRow";
import UserPage from "./UserPage";
import UserCard from "./UserCard";
import { getUser } from "../../store/actions"

import { withRouter } from 'react-router-dom';
import Progress from '../../components/Progress'
import Field from "../../components/Field"

class User extends Component {

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
					this.props.getUser(this.props.userId);
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
					this.props.getUser(this.props.userId);
					return <Progress />;
				}
			}
		}


		switch (this.props.display) {
			case "name":
				return <Field value={this.props.user.displayName} title/>;
			case "page":
				return (
					<UserPage {...this.props} />
				);
			case "row":
				return (
					<UserRow {...this.props} />
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

	console.log(ownProps.userId);

	return {
		user,
		notExists,
		display,
		userId: id,
		ownProfile: ("" + id) === ("" + state.userId),
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUser: (userId) => dispatch(getUser(userId)),
	};
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User));
