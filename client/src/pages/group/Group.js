import React, { Component } from "react";
import { connect } from "react-redux";

import GroupCard from "./GroupCard";
import GroupPage from "./GroupPage";

import { setGroup, getGroup,getGroupEnrollments,getGroupLessons } from "../../store/actions"
import { withRouter } from 'react-router-dom';
import Progress from '../../components/Progress'

class Group extends Component {

	render() {
		if (this.props.group == null) {
			if (this.props.display === "page") {
				if (this.props.notExists) {
					return (
						<div className="page">
							De opgevraagde groep bestaat niet
						</div>
					);
				} else {
					this.props.getGroup(this.props.groupId)
					return (
						<div className="page">
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
					<GroupPage {...this.props} />
				);
			case "card":
			default:
				return (
					<GroupCard {...this.props} />
				);
		}
	}
}


function mapStateToProps(state, ownProps) {
	let id = ownProps.match.params.groupId || ownProps.groupId;
	let display = ownProps.display || "page";

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
		role:state.role,
		groupId: id,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setGroup: (group) => dispatch(setGroup(group)),
		getGroup: (groupId) => dispatch(getGroup(groupId)),
		getGroupEnrollments: (groupId) => dispatch(getGroupEnrollments(groupId)),
		getGroupLessons: (groupId) => dispatch(getGroupLessons(groupId)),
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Group));
