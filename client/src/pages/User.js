import React, { Component } from "react";
import { connect } from "react-redux";

import UserPage from "../components/UserPage";

import { setGroup, getGroup,getGroupEnrollments } from "../store/actions"
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
			case "Page":
				return (
					<UserPage {...this.props} />
				);
			case "Row":
				return (
					<UserPage {...this.props} />
				);
			case "Card":
			default:
				return (
					<UserPage {...this.props} />
				);
		}
	}
}


function mapStateToProps(state, ownProps) {
	let id = ownProps.match.params.id || ownProps.groupId;
	let display = ownProps.display || "Page";

	let notExists = false;
	let group = null;

	if (state.users == null || state.users[id] == null) {
		if (id == null || state.hasFetched.includes("Group.get(" + id + ")")) {
			notExists = true;
		}
	} else {
		group = state.users[id];
	}
	return {
		group,
		notExists,
		display,
		groupId: id,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setGroup: (group) => dispatch(setGroup(group)),
		getGroup: (groupId) => dispatch(getGroup(groupId)),
		getGroupEnrollments: (groupId) => dispatch(getGroupEnrollments(groupId)),

	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Group));
