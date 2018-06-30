import React, { Component } from "react";
import { connect } from "react-redux";

import GroupCard from "./GroupCard";
import GroupPage from "./GroupPage";

import { setGroup, getGroup,getGroupEnrollments } from "../store/actions"
import { withRouter } from 'react-router-dom';
import Progress from './Progress'

class Group extends Component {

	render() {

		if (this.props.group == null) {
			if (this.props.display === "Page") {
				if (this.props.notExists) {
					return (
						<div className="Page">
							De opgevraagde groep bestaat niet
							</div>
					);
				} else {
					this.props.getGroup(this.props.groupId)
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
					<GroupPage {...this.props} />
				);
			case "Card":
			default:
				return (
					<GroupCard {...this.props} />
				);
		}
	}
}


function mapStateToProps(state, ownProps) {
	let id = ownProps.match.params.id || ownProps.groupId;
	let display = ownProps.display || "Page";

	let notExists = false;
	let group = null;

	if (state.groups == null || state.groups[id] == null) {
		if (id == null || state.hasFetched.includes("Group.get(" + id + ")")) {
			notExists = true;
		}
	} else {
		group = state.groups[id];
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
