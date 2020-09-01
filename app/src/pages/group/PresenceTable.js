import React, { Component } from 'react';
import map from "lodash/map"
import filter from "lodash/filter"
import User from "../user/User"
import Field from "../../components/Field"
import { Paper } from '@material-ui/core';

class PresenceTable extends Component {

	createPresenceComponent(presence, i) {
		let options = [{ label: "Actief", value: "present" },
		{ label: "Niet actief", value: "absent" }];
		if (!this.props.editable && presence.userStatus === "absent") {
			options[0].label = "Afgemeld";
			options[1].label = "Afgemeld";
		}
		return <Field
			key={i}
			value={presence.status}
			options={options}
			label={presence.userStatus === "absent" ? "afgemeld" : undefined}
			layout={{ td: true, area: true }}
			editable={this.props.editable}
			onChange={(status) => {
				this.props.handleChange({
					...presence,
					status,
				});
			}}
		/>;
	}

	createRow = (participantId) => {
		const content = map(this.props.lessons, ((lesson, i) => {
			const p = filter(this.props.presence, presence => {
				return presence.lessonId === lesson.id && presence.userId === participantId;
			});
			if (p.length === 1) {
				return this.createPresenceComponent(p[0], i);
			} else {
				return this.createPresenceComponent({
					id: Math.floor(-Math.random() * 100000),
					lessonId: lesson.id,
					userId: participantId,
					status: "present",
				}, i);
			}
		}));

		return (
			<Paper component="tr" elevation={1} key={"p" + participantId}>
				<User key={participantId} userId={participantId} display="name" />
				{content}
			</Paper>
		);
	}

	createLessonHeader = (lesson) => {
		const content = map(this.props.lessons, lesson => {
			return <Field
				value={"Les " + lesson.numberInBlock}
				key={lesson.id}
				style={{ type: "title" }}
				layout={{ td: true}}
			/>;
		});
		return (
			<Paper component="tr" elevation={2} key={"l" + lesson} style={{ backgroundColor: "#e0e0e0" }} >
				<Field value="" layout={{ td: true, width:"20%" }} />
				{content}
			</Paper>
		);
	}

	render() {
		let rows = this.props.participantIds.map(this.createRow);
		rows.unshift(this.createLessonHeader());
		return <table>
			<tbody>
				{rows}
			</tbody>
		</table>;
	}

}

export default PresenceTable;