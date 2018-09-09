import React, { Component } from 'react';
import map from "lodash/map"
import User from "../user/User"
import Field from "../../components/Field"

class PresenceTable extends Component {

	createPresenceComponent(presence) {
		return <Field value={presence.status} />;
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
			<div style={{ display: "flex" }}>
				<User key={participantId} userId={participantId} display="name" />
				{content}
			</div>
		);
	}

	createLessonHeader() {
		const content = map(this.props.lessons, lesson => {
			return <Field value={"Les " + lesson.numberInBlock} />;
		});
		return (
			<div style={{ display: "flex" }}>
				<div style={{ flex: 1 }} />
				{content}
			</div>
		);
	}

	render() {
		return (
			<div>
				{this.createLessonHeader()}
				{this.props.participantIds.map(this.createRows)}
			</div>
		);
	}

}

export default PresenceTable;
