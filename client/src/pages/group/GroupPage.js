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

class GroupPage extends Component {

	constructor(props) {
		super(props);
		const studentTabs = ["Lessen"];
		const teacherTabs = ["Inschrijvingen", "Lessen", "Deelnemers", "Activiteit", "Beoordeling"];
		this.state = {
			currentTab: 0,
			tabs: this.props.role === "teacher" ? teacherTabs : studentTabs,
			editable: false,
			group: this.props.group,
		}
	}

	getCurrentTab(currentTab) {
		let group = this.state.group;
		switch (this.state.tabs[currentTab]) {
			case "Inschrijvingen":
				const enrollmentIds = this.state.group.enrollmentIds || this.props.group.enrollmentIds;
				if (enrollmentIds == null) {
					this.props.getGroupEnrollments(group.id);
					return <Progress />;
				}
				if (enrollmentIds.length === 0) {
					return "Er zijn geen inschrijvingen";
				}
				return enrollmentIds.map(id => {
					return <User key={id} userId={id} display="row" />
				});
			case "Lessen":
				const lessons = this.state.group.lessons || this.props.group.lessons;
				if (lessons == null) {
					this.props.getGroupLessons(group.id);
					return <Progress />;
				}
				if (lessons.length === 0) {
					return "Er zijn nog geen lessen bekend";
				}
				return map({ 0: {id:-1}, ...lessons }, lesson => {
					return <Lesson lesson={lesson} key={lesson.id} editable={this.state.editable} handleChange={this.handleLessonChange} />
				});
			case "Deelnemers":
				const participantIds = this.state.group.participantIds || this.props.group.participantIds;
				if (participantIds == null) {
					this.props.getGroupParticipants(group.id);
					return <Progress />;
				}
				if (participantIds.length === 0) {
					return "Er zijn nog geen deelnemers toegevoegd";
				}
				return participantIds.map(id => {
					return <User key={id} userId={id} display="row" />
				});
			case "Beoordeling":
				const evaluations = this.state.group.evaluations || this.props.group.evaluations;
				if (evaluations == null) {
					this.props.getGroupEvaluations(group.id);
					return <Progress />;
				}
				return <EvaluationTab evaluations={evaluations} groupId={group.id} />
			default: return null;
		}

	}

	handleChange = (event) => {
		this.setState({
			group: {
				...this.state.group,
				[event.name]: event.target.value,
			}
		});
	}

	handleLessonChange = (lesson) => {
		let lessons = this.state.group.lessons || this.props.group.lessons;
		this.setState({
			group: {
				...this.state.group,
				lessons: {
					...lessons,
					[lesson.id]: lesson,
				}
			}
		});
	}

	setEditable = () => {
		this.setState({
			editable: true,
		});
	}

	cancel = () => {
		this.setState({
			editable: false,
			group: this.props.group,
		});
	}

	save = () => {
		this.props.setGroup(this.state.group);
		this.setState({
			editable: false,
		});
	}

	handleTab = (event, currentTab) => {
		this.setState({ currentTab });
	};


	handleClickAway = () => {
		this.setState({ anchorEl: null });
	}

	showTeacherCard = event => {
		this.setState({ anchorEl: event.currentTarget });
	}

	render() {
		const editable = this.state.editable;
		let group = this.state.group;
		return (
			<Page>
				<div style={{ display: "flex" }}>
					<Field value={group.courseName} name="courseName" onChange={this.handleChange} headline editable={editable} style={{ flex: "5" }} />
					<Field value={group.subjectId} name="subjectId" onChange={this.handleChange} right headline editable={editable} options={map(this.props.subjects, (subject) => { return { value: subject.id, label: subject.name } })} />
				</div>
				<Button color="secondary" style={{ float: "right" }} onClick={this.showTeacherCard}>
					{group.teacherName}
				</Button>
				<Field value={group.period} name="period" onChange={this.handleChange} caption style={{ width: "100px" }} options={[{ label: "Blok 1", value: 1 }, { label: "Blok 2", value: 2 }, { label: "Blok 3", value: 3 }, { label: "Blok 4", value: 4 }]} />
				<Field value={group.day} name="day" onChange={this.handleChange} caption options={["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"]} />
				<br />
				<Field value={group.courseDescription} name="courseDescription" onChange={this.handleChange} area editable={editable} />
				<Divider />
				{this.props.role === "student" &&
					<ChooseButton
						group={group}
						style={{ margin: "20px" }}
					/>
				}
				{((this.props.role === "teacher" || this.props.role === "admin") && !this.state.editable) &&
					<Button color="secondary" variant="contained" style={{ margin: "20px" }} onClick={this.setEditable}>
						{"Bewerken"}
					</Button>
				}
				{this.state.editable &&
					<Button color="secondary" variant="contained" style={{ margin: "20px" }} onClick={this.save}>
						{"Opslaan"}
					</Button>
				}
				{this.state.editable &&
					<Button color="default" style={{ margin: "20px" }} onClick={this.cancel}>
						{"Annuleren"}
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

