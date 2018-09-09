import React, { Component } from 'react';
import map from "lodash/map"
import filter from "lodash/filter"
import User from "../user/User"
import Field from "../../components/Field"
import { Paper } from '@material-ui/core';

class PresenceTable extends Component {

	createPresenceComponent(presence) {
		return <Field
			value={presence.status}
			options={[
				{ label: "Actief", value: "present" },
				{ label: "Niet actief", value: "absent" }
			]}
			editable={this.props.editable}
			margin="none"
			onChange={(event) => {
				this.props.handleChange({
					...presence,
					status: event.target.value,
				});
			}}
		/>;
	}

	createRows = (participantId) => {
		const content = map(this.props.lessons, (lesson => {
			const p = filter(this.props.presence, presence => {
				return presence.lessonId === lesson.id && presence.studentId === participantId;
			});
			if (p.length === 1) {
				return this.createPresenceComponent(p[0]);
			} else {
				return "err";
			}
		}));

		return (
			<Paper style={{ display: "flex", marginTop: "10px" }}>
				<User key={participantId} userId={participantId} display="name" />
				{content}
			</Paper>
		);
	}

	createLessonHeader() {
		const content = map(this.props.lessons, lesson => {
			return <Field value={"Les " + lesson.numberInBlock} title />;
		});
		return (
			<Paper style={{ display: "flex" }}>
				<Field value="" />
				{content}
			</Paper>
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
