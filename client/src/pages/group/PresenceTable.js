import React, { Component } from 'react';
import map from "lodash/map"
import User from "../user/User"

class PresenceTable extends Component {

	createPresenceComponent(presence) {
		return presence.status;
	}

	createRows = (participantId) => {
		const content = map(this.props.lessons, (lesson => {
			const p = this.props.presence.filter(presence => {
				return presence.lessonId === lesson.id && presence.studentId === participantId;
			});
			if (p.length === 1) {
				return this.createPresenceComponent(p[0]);
			} else {
				return "err";
			}
		}));

		return (
			<div>
				{content}
			</div>
		);
	}


	render() {
		return this.props.participantIds.map(this.createRows);
	}

}

export default PresenceTable;
