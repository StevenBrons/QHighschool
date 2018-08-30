import React, { Component } from "react";
import { connect } from "react-redux";

import GroupCard from "./GroupCard";
import GroupPage from "./GroupPage";
import {
	setGroup,
	getGroup,
	getGroupEnrollments,
	getGroupLessons,
	getGroupParticipants,
	getGroupEvaluations,
	getSubjects
} from "../../store/actions";
import { withRouter } from 'react-router-dom';
import Progress from '../../components/Progress'

class Group extends Component {

	render() {
		if (this.props.group == null || this.props.subjects == null) {
			if (this.props.display === "page") {
				if (this.props.notExists) {
					return (
						<div className="page">
							De opgevraagde groep bestaat niet
						</div>
					);
				} else {
					this.props.getSubjects();
					this.props.getGroup(this.props.groupId);
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
		if (id == null || state.hasFetched.indexOf("Group.get(" + id + ")") !== -1) {
			notExists = true;
		}
	} else {
		group = state.groups[id];
	}
	return {
		group,
		notExists,
		display,
		role: state.role,
		groupId: id,
		subjects: state.subjects,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setGroup: (group) => dispatch(setGroup(group)),
		getGroup: (groupId) => dispatch(getGroup(groupId)),
		getGroupEnrollments: (groupId) => dispatch(getGroupEnrollments(groupId)),
		getGroupLessons: (groupId) => dispatch(getGroupLessons(groupId)),
		getGroupParticipants: (groupId) => dispatch(getGroupParticipants(groupId)),
		getGroupEvaluations: (groupId) => dispatch(getGroupEvaluations(groupId)),
		getSubjects: () => dispatch(getSubjects()),
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Group));
