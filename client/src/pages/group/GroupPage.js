import React, { Component } from 'react';
import { withRouter } from 'react-router';
import map from 'lodash/map';

import ChooseButton from './ChooseButton';
import Field from '../../components/Field';
import Lesson from '../../components/Lesson';
import EvaluationTab from './EvaluationTab';
import User from "../user/User"
import Page from '../Page';

import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Progress from '../../components/Progress'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class GroupPage extends Component {

	constructor(props) {
		super(props);
		const studentTabs = ["Lessen"];
		const teacherTabs = ["Inschrijvingen", "Lessen", "Deelnemers", "Activiteit", "Beoordeling"];
		this.state = {
			currentTab: 0,
			tabs: this.props.role === "teacher" ? teacherTabs : studentTabs,
			editable: false,
		}
	}

	getCurrentTab(currentTab) {
		const group = this.props.group;
		switch (this.state.tabs[currentTab]) {
			case "Inschrijvingen":
				if (group.enrollmentIds == null) {
					this.props.getGroupEnrollments(group.id);
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
					this.props.getGroupLessons(group.id);
					return <Progress />;
				}
				if (group.lessons.length === 0) {
					return "Er zijn nog geen lessen bekend";
				}
				return group.lessons.map(lesson => {
					return <Lesson lesson={lesson} key={lesson.id} />
				});
			case "Deelnemers":
				if (group.participantIds == null) {
					this.props.getGroupParticipants(group.id);
					return <Progress />;
				}
				if (group.participantIds.length === 0) {
					return "Er zijn nog geen deelnemers toegevoegd";
				}
				return group.participantIds.map(id => {
					return <User key={id} userId={id} display="row" />
				});
			case "Beoordeling":
				if (group.evaluations == null) {
					this.props.getGroupEvaluations(this.props.groupId);
					return <Progress />;
				}
				return <EvaluationTab evaluations={group.evaluations} groupId={group.id} />
			default: return null;
		}

	}

	setEditable() {
		this.setState({
			editable: true,
		});
	}

	handleTab = (event, currentTab) => {
		this.setState({ currentTab });
	};


	handleClickAway = () => {
		this.setState({ anchorEl: null });
	}

	showTeacherCard = event => {
		//TODO teacher
		this.setState({ anchorEl: event.currentTarget });
	};

	render() {
		const group = this.props.group;
		const editable = this.state.editable;
		return (
			<Page>
				<div style={{ display: "flex" }}>
					<Field value={group.courseName} headline editable={editable} />
					{
						editable ?
							<Field value={group.subjectId} right headline editable options={map(this.props.subjects, (subject) => { return { value: subject.id, label: subject.name } })} /> :
							<Field value={group.subjectName} right headline />
					}
				</div>
				<Button color="secondary" style={{ float: "right" }} onClick={this.showTeacherCard}>
					{group.teacherName}
				</Button>
				<Field value={group.period} caption style={{ width: "100px" }} editable={editable} options={[{ label: "Blok 1", value: 1 }, { label: "Blok 2", value: 2 }, { label: "Blok 3", value: 3 }, { label: "Blok 4", value: 4 }]} />
				<Field value={group.day} caption editable={editable} />
				<br />
				<Field value={group.courseDescription} area editable={editable} />
				<Divider />
				{this.props.role === "student" &&
					<ChooseButton
						group={group}
						style={{ margin: "20px" }}
					/>
				}
				{(this.props.role === "teacher" || this.props.role === "admin") &&
					<Button color="secondary" variant="contained" style={{ margin: "20px" }} onClick={this.setEditable.bind(this)}>
						{"Bewerken"}
					</Button>
				}
				<Popover
					open={this.state.anchorEl ? true : false}
					onClose={this.handleClickAway}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ vertical: "top" }}
				>
					<User key={group.teacherId} userId={group.teacherId} display="card" style={{ margin: "0px" }} />
				</Popover>

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
						{this.state.tabs.map(tab => <Tab key={tab} label={tab} />)}
					</Tabs>
				</AppBar>
				<br />
				<div style={{ width: "95%", margin: "auto" }}>
					{this.getCurrentTab(this.state.currentTab)}
				</div>
			</Page>
		);
	}

}


export default withRouter(GroupPage);

