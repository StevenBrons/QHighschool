import React, { Component } from 'react';
import { withRouter } from 'react-router';
import map from 'lodash/map';

import PresenceTable from './PresenceTable';
import Lesson from './Lesson';
import { EvaluationTab } from './Evaluation';
import Page from '../Page';
import UserList from "../user/UserList"

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Progress from '../../components/Progress'
import PageLeaveWarning from '../../components/PageLeaveWarning'
import GroupData from './GroupData';
import ChooseButton from './ChooseButton';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import queryString from "query-string";
import NotificationBadge from '../../components/NotificationBadge';
import SelectUser from '../../components/SelectUser';
import Field from '../../components/Field';
import { Typography, Tooltip } from '@material-ui/core';

class GroupPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			editable: false,
			group: this.props.group,
			newParticipant: {
				participatingRole: "student",
				userId: null,
			}
		}

		switch (this.props.role) {
			case "student":
				if (this.props.userIsMemberOfGroup) {
					this.state.tabs = ["Lessen", "Deelnemers"];
				} else {
					this.state.tabs = ["Lessen"];
				}
				break;
			case "teacher":
				if (this.props.userIsMemberOfGroup) {
					this.state.tabs = ["Inschrijvingen", "Lessen", "Deelnemers", "Actief", "Beoordeling"];
				} else {
					this.state.tabs = ["Lessen"];
				}
				break;
			case "admin":
				this.state.tabs = ["Inschrijvingen", "Lessen", "Deelnemers", "Actief", "Beoordeling"];
				break;
			default:
				break;
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		return {
			...prevState,
			group: {
				...nextProps.group,
				...prevState.group,
			},
			currentTab: values.tab ? values.tab : prevState.tabs[0]
		}
	}

	getCurrentTab(currentTab) {
		let group = this.state.group;
		const enrollmentIds = this.state.group.enrollmentIds;
		const lessons = this.state.group.lessons;
		const participantIds = this.state.group.participantIds;
		const evaluations = this.state.group.evaluations;
		const presence = this.state.group.presence;
		const newParticipant = this.state.newParticipant;

		switch (currentTab) {
			case "Inschrijvingen":
				if (enrollmentIds == null) {
					return <Progress />;
				}
				if (enrollmentIds.length === 0) {
					return "Er zijn geen inschrijvingen";
				}
				return <UserList userIds={enrollmentIds} />;
			case "Lessen":
				if (lessons == null) {
					return <Progress />;
				}
				if (lessons.length === 0) {
					return "Er zijn nog geen lessen bekend";
				}
				return <table style={{ width: "100%" }}>
					<tbody>
						{map({ 0: { id: -1 }, ...lessons }, lesson => {
							return <Lesson
								lesson={lesson}
								key={lesson.id}
								role={this.props.role}
								userIsMemberOfGroup={this.props.userIsMemberOfGroup}
								editable={this.state.editable}
								handleChange={this.handleLessonChange}
							/>
						})}
					</tbody>
				</table>
			case "Deelnemers":
				if (participantIds == null) {
					return <Progress />;
				}
				return (
				<div >
					{
						this.props.role === "admin" && this.state.editable &&
						<div>
							<Typography variant="title" color="primary" style={{ margin: "18px 12px"}}>
								Nieuwe deelnemer:
							</Typography>
							<div style={{display:"inline-flex"}}>
								<SelectUser onChange={this.handleNewParticipantIdChange} value={newParticipant.userId} />
								<Field editable label="Rol" value={newParticipant.participatingRole} options={[{value:"student", label:"Leerling"},{value:"teacher", label:"Docent"}]} onChange={this.handleNewParticipantRoleChange} />
								<Tooltip title={participantIds.includes(newParticipant.userId) || enrollmentIds.includes(newParticipant.userId) ? "Deze gebruiker heeft zich al ingeschreven of is al een deelnemer": ""} placement={"bottom-start"} enterDelay={200}>
									<div>
										<Button variant="contained" 
										disabled={newParticipant.userId == null || participantIds.includes(newParticipant.userId) || enrollmentIds.includes(newParticipant.userId) }
										color="primary" style={{marginTop:"22px"}} onClick={this.addNewParticipant}>
											Voeg toe	</Button>
									</div>
								</Tooltip>
							</div>
							<Divider/>
							<br/>
						</div>
					}
					{
						participantIds.length === 0 ? "Er zijn nog geen deelnemers toegevoegd" :
						<UserList userIds={participantIds} />
					}
				</div>
				);

			case "Actief":
				if (participantIds == null || lessons == null || presence == null) {
					return <Progress />;
				}
				return <PresenceTable
					participantIds={participantIds}
					lessons={lessons}
					presence={presence}
					editable={this.state.editable}
					handleChange={this.handlePresenceChange}
				/>
			case "Beoordeling":
				if (participantIds == null || evaluations == null) {
					return <Progress />;
				}
				return <EvaluationTab
					evaluations={evaluations}
					groupId={group.id}
					editable={this.state.editable}
					handleChange={this.handleEvaluationChange}
				/>
			default: return null;
		}

	}

	addNewParticipant = event => {
		const newParticipant = this.state.newParticipant;
		this.props.addParticipant(this.props.groupId,newParticipant.userId,newParticipant.participatingRole);
		this.setState(prevState => ({
			...prevState,
			newParticipant: {
				participatingRole: prevState.newParticipant.participatingRole,
				userId: null,
			}
		}))
	}

	handleNewParticipantRoleChange = value => {
		this.setState( prevState => ({
			...prevState,
			newParticipant: {
				participatingRole: value,
				userId: prevState.newParticipant.userId,
			},
		}))
	}

	handleNewParticipantIdChange = value => {
		this.setState( prevState => ({
			...prevState,
			newParticipant: {
				userId: value,
				participatingRole: prevState.newParticipant.participatingRole,
			},
		}))
	}

	componentDidMount() {
		this.getData();
	}

	componentDidUpdate() {
		this.getData();
	}

	getData() {
		let group = this.state.group;
		const enrollmentIds = this.state.group.enrollmentIds;
		const lessons = this.state.group.lessons;
		const participantIds = this.state.group.participantIds;
		const evaluations = this.state.group.evaluations;
		const presence = this.state.group.presence;

		switch (this.state.currentTab) {
			case "Inschrijvingen":
				if (enrollmentIds == null) {
					this.props.getGroupEnrollments(group.id);
				}
				break;
			case "Lessen":
				if (lessons == null) {
					this.props.getGroupLessons(group.id);
				}
				break;
			case "Deelnemers":
				if (participantIds == null) {
					this.props.getGroupParticipants(group.id);
				}
				if (enrollmentIds == null) {
					this.props.getGroupEnrollments(group.id);//also get enrollments because we're checking if new userId is in enrollmenIds
				}
				break;
			case "Actief":
				if (participantIds == null) {
					this.props.getGroupParticipants(group.id);
				}
				if (lessons == null) {
					this.props.getGroupLessons(group.id);
				}
				if (presence == null) {
					this.props.getGroupPresence(group.id);
				}
				break;
			case "Beoordeling":
				if (evaluations == null) {
					this.props.getGroupEvaluations(group.id);
				}
				if (participantIds == null) {
					this.props.getGroupParticipants(group.id);
				}
				break;
			default: break;
		}
	}

	handleChange = (name,value) => {
		this.setState({
			group: {
				...this.state.group,
				[name]: value,
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

	handleEvaluationChange = (newEvaluations) => {
		this.setState({
			group: {
				...this.state.group,
				evaluations: newEvaluations,
			}
		});
	}

	handlePresenceChange = (presenceObj) => {
		let presence = this.state.group.presence || this.props.group.presence;
		this.setState({
			group: {
				...this.state.group,
				presence: {
					...presence,
					[presenceObj.id]: presenceObj,
				},
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

	handleTab = (event, newTab) => {
		this.props.history.push({
			search: "tab=" + this.state.tabs[newTab],
		});
	};


	render() {
		const editable = this.state.editable;
		const role = this.props.role;
		let group = this.state.group;
		return (
			<Page>
				<GroupData {...this.props} editable={editable} group={group} onChange={this.handleChange} />
				<Divider />
				{
					role === "student" &&
					<ChooseButton
						group={group}
						style={{ margin: "20px" }}
					/>
				}
				{
					((role === "teacher" || role === "admin") && !editable) &&
					<Button color="secondary" variant="contained" style={{ margin: "20px" }} onClick={this.setEditable}>
						{"Bewerken"}
					</Button>
				}
				{
					editable &&
					<Button color="secondary" variant="contained" style={{ margin: "20px" }} onClick={this.save}>
						{"Opslaan"}
					</Button>
				}
				{
					editable &&
					<Button color="default" style={{ margin: "20px" }} onClick={this.cancel}>
						{"Annuleren"}
					</Button>
				}
				<AppBar position="static" color="default">
					<Tabs
						value={this.state.tabs.indexOf(this.state.currentTab)}
						onChange={this.handleTab}
						indicatorColor="primary"
						textColor="primary"
						fullWidth
						centered
					>
						{this.state.tabs.map(tab => 
						<Tab key={tab} label={
							<NotificationBadge scope={"groep/" + ( group.id || "" ) + "?tab=" + tab} style={{paddingLeft:"100px"}}>
								{tab}
							</NotificationBadge>
							} />) }
					</Tabs>
				</AppBar>
				<br />
				<div style={{ width: "98%", margin: "auto" }}>
					{this.getCurrentTab(this.state.currentTab)}
				</div>
				<PageLeaveWarning giveWarning={this.state.editable} />
			</Page>
		);
	}

}



export default withRouter(GroupPage);

