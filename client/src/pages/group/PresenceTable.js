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
			layout={{ td: true, area: true }}
			editable={this.props.editable}
			onChange={(event) => {
				this.props.handleChange({
					...presence,
					status: event.target.value,
				});
			}}
		/>;
	}

	createRow = (participantId) => {
		const content = map(this.props.lessons, (lesson => {
			const p = filter(this.props.presence, presence => {
				return presence.lessonId === lesson.id && presence.userId === participantId;
			});
			if (p.length === 1) {
				return this.createPresenceComponent(p[0]);
			} else {
				return "err";
			}
		}));

		return (
			<Paper component="tr" elevation={1}>
				<User key={participantId} userId={participantId} display="name" />
				{content}
			</Paper>
		);
	}

	createLessonHeader() {
		const content = map(this.props.lessons, lesson => {
			return <Field value={"Les " + lesson.numberInBlock} style={{ type: "title" }} layout={{ td: true, area: true }} />;
		});
		return (
			<Paper component="tr" elevation={2} style={{ backgroundColor: "#e0e0e0" }} >
				<Field value="" layout={{ td: true, area: true }} />
				{content}
			</Paper>
		);
	}

	render() {
		let rows = this.props.participantIds.filter((partId) => {
			return map(this.props.presence, (p) => p.userId).indexOf(partId) !== -1;
		}).map(this.createRow);
		rows.unshift(this.createLessonHeader());
		return rows;
	}

}

export default PresenceTable;