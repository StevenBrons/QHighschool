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
		if (this.props.groupIds == null) {
			content = <Progress />
		} else {
			content = this.props.groupIds.map((id) => {
				return <Group
					key={id}
					groupId={id}
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
	if (state.groups == null || state.users[state.userId].participatingGroupIds == null) {
		return {
			groupIds: null,
		}
	} else {
		return {
			groupIds: state.users[state.userId].participatingGroupIds,
		};
	}

}

function mapDispatchToProps(dispatch) {
	return {
		getParticipatingGroups: () => dispatch(getParticipatingGroups()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyGroups);


