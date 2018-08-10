import React, { Component } from 'react';
import { withRouter } from 'react-router';

import ChooseButton from './ChooseButton';
import Field from '../../components/Field';
import Lesson from '../../components/Lesson';
import User from "../user/User"
import Page from '../Page';

import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Progress from '../../components/Progress'

class GroupPage extends Component {

	constructor(props) {
		super(props);
		const studentTabs = ["Lessen"];
		const teacherTabs = ["Inschrijvingen","Lessen","Deelnemers","Activiteit","Beoordeling"];
		this.state = {
			currentTab: 0,
			tabs: this.props.role === "teacher" ? teacherTabs : studentTabs,
			editable:false,
		}
	}

	getCurrentTab(currentTab) {
		const group = this.props.group;
		switch (this.state.tabs[currentTab]) {
			case "Inschrijvingen":
				if (group.enrollmentIds == null) {
					this.props.getGroupEnrollments(this.props.group.id);
					return <Progress />;
				}
				if (group.enrollmentIds.length === 0) {
					return "Er zijn geen inschrijvingen";
				}
				return group.enrollmentIds.map(id => {
					return <User key={id} userId={id} display="row" />
				});
			case "Lessen":
				if (group.lessons == null) {
					this.props.getGroupLessons(this.props.group.id);
					return <Progress />;
				}
				if (group.lessons.length === 0) {
					return "Er zijn nog geen lessen bekend";
				}
				return group.lessons.map(lesson => {
					return <Lesson lesson={lesson} key={lesson.id}/>
				});
			case "Deelnemers":
				if (group.participantIds == null) {
					return <Progress />;
				}
				if (group.participantIds.length === 0) {
					return "Er zijn nog geen deelnemers toegevoegd";
				}
				return group.participantIds.map(id => {
					return <User key={id} userId={id} display="row" />
				});
			default: return null;
		}

	}

	setEditable() {
		this.setState({
			editable:true,
		});
	}

	handleTab = (event, currentTab) => {
		this.setState({ currentTab });
	};

	render() {
		const group = this.props.group;
		const editable = this.state.editable;
		return (
			<Page>
				<Field value={group.courseName} headline  editable={editable}/>
				<Field value={group.subjectName} right headline editable={editable}/>
				<br />
				<Field value={group.teacherName} right  editable={editable}/>
				<Field value={"Periode " + group.period} caption style={{ width: "100px" }}  editable={editable}/>
				<Field value={group.day} caption  editable={editable}/>
				<br />
				<Field value={group.courseDescription} area  editable={editable}/>
				<Divider />
				{this.props.role === "student" &&
					<ChooseButton
						group={group}
						style={{ margin: "20px" }}
					/>
				}
				{this.props.role === "teacher" &&
					<Button color="secondary" variant="contained" style={{ margin: "20px" }} onClick={this.setEditable.bind(this)}>
						{"Bewerken"}
					</Button>
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
						{this.state.tabs.map(tab => <Tab key={tab} label={tab} />) }
					</Tabs>
				</AppBar>
				<br/>
				<div style={{ width: "95%", margin: "auto" }}>
					{this.getCurrentTab(this.state.currentTab)}
				</div>
			</Page>
		);
	}

}


export default withRouter(GroupPage);

