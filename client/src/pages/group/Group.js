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
	getGroupPresence,
	getSubjects,
	addNotification,
	addParticipant,
} from "../../store/actions";
import { withRouter } from 'react-router-dom';
import Progress from '../../components/Progress'
import Page from '../Page';

class Group extends Component {

	componentWillMount() {
		const props = this.props;
		if (props.subjects == null) {
			props.getSubjects();
		}
		if (props.group == null && !props.notExists) {
			props.getGroup(props.groupId);
		}
	}

	render() {
		if (this.props.group == null) {
			if (this.props.display === "page" && this.props.notExists) {
				return (
					<Page>
						De opgevraagde groep bestaat niet
					</Page>
				);
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
	let id = (ownProps.match.params.groupId || ownProps.groupId) + "";
	let display = ownProps.display || "page";

	let notExists = false;
	let group = null;

	let userIsMemberOfGroup = state.users[state.userId].participatingGroupIds.indexOf(id) !== -1;
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
		userId: state.userId,
		userIsMemberOfGroup,
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
		getGroupPresence: (groupId) => dispatch(getGroupPresence(groupId)),
		getSubjects: () => dispatch(getSubjects()),
		addParticipant: (userId, groupId, participatingRole) => dispatch(addParticipant(userId, groupId, participatingRole)),
		addNotification: (notification) => dispatch(addNotification(notification)),
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Group));
