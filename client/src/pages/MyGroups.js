import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from './Page';
import { getParticipatingGroups } from '../store/actions';
import Group from './group/Group';
import Progress from '../components/Progress';

class MyGroups extends Component {

	componentWillMount() {
		this.props.getParticipatingGroups();
	}

	render() {
		let content;
		if (this.props.groups == null) {
			content = <Progress />
		} else {
			content = this.props.groups.map((group) => {
				return <Group
					key={group.id}
					groupId={group.id}
					display="card"
				/>
			});
		}

		return (
			<Page>
				{content}
			</Page>
		);
	}
}

function mapStateToProps(state) {
	if (state.users[state.userId].participatingGroupsIds == null) {
		return {
			groups: null,
		}
	} else {
		return {
			groups: state.users[state.userId].participatingGroupsIds.map(id => state.groups[id]),
		};
	}

}

function mapDispatchToProps(dispatch) {
	return {
		getParticipatingGroups: () => dispatch(getParticipatingGroups()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyGroups);


