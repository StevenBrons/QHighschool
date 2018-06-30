import React, { Component } from 'react';
import { withRouter } from 'react-router';

import ChooseButton from '../components/ChooseButton';
import Field from '../components/Field';

import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Group } from "../lib/Data"

import User from "../pages/User"

class GroupPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentTab: 0,
		}
	}

	getCurrentTab(currentTab) {
		switch (currentTab) {
			case 0:
			if (this.props.group.enrollments == null) {
				this.props.getGroupEnrollments(this.props.group.id);
				return null;
			}
			return this.props.group.enrollments.map(enrollment => {
				return <User userId={enrollment.id} display="row"/>
			});
		}

	}

	handleTab = (event, currentTab) => {
		this.setState({ currentTab });
	};

	render() {
		const group = this.props.group;
		return (
			<div className="Page" style={this.state.style}>
				<Field value={group.subjectName} right headline />
				<Field value={group.courseName} headline />
				<br />
				<Field value={group.teacherName} right />
				<Field value={"Periode " + group.period} caption style={{ width: "100px" }} />
				<Field value={group.day} caption />
				<br />
				<Field value={group.courseDescription} area />
				<Divider />
				{this.props.role === "student" &&
					<ChooseButton
						group={group}
						style={{ margin: "20px" }}
					/>
				}
				<Divider />
				<AppBar position="static" color="default">
					<Tabs
						value={this.state.currentTab}
						onChange={this.handleTab}
						indicatorColor="primary"
						textColor="primary"
						fullWidth
						centered
					>
						{this.props.role === "teacher" && <Tab label="Aanmeldingen" />}
						<Tab label="Lessen" />
						<Tab label="Deelnemers" />
						{this.props.role === "teacher" && <Tab label="Presentie" />}
						{this.props.role === "teacher" && <Tab label="Beoordeling" />}
					</Tabs>
				</AppBar>
				{this.getCurrentTab(this.state.currentTab)}
			</div >
		);
	}

}


export default withRouter(GroupPage);

