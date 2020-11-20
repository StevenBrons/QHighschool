import React, { Component } from 'react';
import map from "lodash/map";
import filter from "lodash/filter";
import { Paper, Typography } from '@material-ui/core';
import SelectField from '../../fields/SelectField';
import { connect } from 'react-redux';

class PresenceTable extends Component {

	createPresenceComponent(presence, i) {
		let options = [{ label: "Actief", value: "present" },
		{ label: "Niet actief", value: "absent" }];
		if (!this.props.editable && presence.userStatus === "absent") {
			options[0].label = "Afgemeld";
			options[1].label = "Afgemeld";
		}
		return <SelectField
			key={i}
			value={presence.status}
			options={options}
			label={presence.userStatus === "absent" ? "afgemeld" : undefined}
			td
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
				<Typography color="primary" component="td">
					{this.props.users[participantId].displayName}
				</Typography>
				{content}
			</Paper>
		);
	}

	createLessonHeader = (lesson) => {
		const content = map(this.props.lessons, lesson => {
			return <Typography key={lesson.id} component="td" color="primary">
				{"Les " + lesson.numberInBlock}
			</Typography>
		});
		return (
			<Paper
				component="tr"
				elevation={2}
				key={"l" + lesson}
				style={{ backgroundColor: "#e0e0e0" }}
			>
				<Typography component="td" />
				{content}
			</Paper>
		);
	}

	render() {
		let rows = this.props.participantIds.map(this.createRow);
		rows.unshift(this.createLessonHeader());
		return <table style={{ width: "100%" }}>
			<tbody>
				{rows}
			</tbody>
		</table>;
	}

}

function mapStateToProps(state, ownProps) {
	return {
		users: state.users,
		...ownProps
	}
}

export default connect(mapStateToProps)(PresenceTable);