import React, { Component } from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';

import Page from './Page';
import Progress from '../components/Progress';
import Field from '../components/Field';
import Group from './group/Group';
import { getSubjects, getGroups } from '../store/actions';

import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

class CourseSelect extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sortMethod: "subject",
			sortSubjectId: null,
			filterMethod: "none",
		}
	}

	componentDidMount() {
		this.props.getSubjects();
		this.props.getGroups();
	}

	getGroupsPerSubject(subjectId) {
		return filter(this.props.groups, (group) => {
			return subjectId + "" === group.subjectId + "";
		})
	}

	handleSortChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		let data;
		switch (this.state.sortMethod) {
			case "subject":
				let sortSubjectId = this.state.sortSubjectId || Object.keys(this.props.subjects)[0];
				if (this.props.subjects == null || this.props.groups == null) {
					data = <Progress />
					break;
				}
				data = this.getGroupsPerSubject(sortSubjectId)
					.sort((a, b) => a.period - b.period)
					.filter((group) => {
						switch (this.state.filterMethod) {
							case "period1":
								return group.period === 1;
							case "period2":
								return group.period === 2;
							case "period3":
								return group.period === 3;
							case "period4":
								return group.period === 4;
							default:
								return true;
						}
					})
					.map((group) => {
						return <Group
							key={group.id}
							groupId={group.id}
							display="card"
						/>
					});
				break;
			case "enrolled":
				if (this.props.enrolledGroupsIds == null) {
					data = <Progress />
					break;
				}
				data = this.props.enrolledGroupsIds.map((groupId) => {
					return (
						<Group
							key={groupId}
							groupId={groupId}
							display="card"
						/>
					);
				});
				if (this.props.enrolledGroupsIds.length === 0) {
					data = (
						<div style={{ margin: "15px" }} >
							Je hebt je nog niet ingeschreven.
						</div>
					)
				}
				break;
			default:
				break;
		}

		const subjects = map(this.props.subjects, (subject) => {
			let color = (this.state.sortSubjectId === subject.id && this.state.sortMethod === "subject") ? "secondary" : "primary";
			if (this.state.sortSubjectId == null && subject.id + "" === Object.keys(this.props.subjects)[0]) {
				color = "secondary";
			}
			return (
				<ListItem button onClick={() => {
					this.setState({
						sortMethod: "subject",
						sortSubjectId: subject.id,
					})
				}}
					key={subject.id}>
					<ListItemText>
						<Typography variant="title" color={color}>
							{subject.name}
						</Typography>
					</ListItemText>
				</ListItem >
			);
		});

		return (
			<Page>
				<Paper
					elevation={2}
					style={{ position: "relative" }}
				>
					<Toolbar>
						<Typography variant="subheading" color="textSecondary" style={{ width: "90%" }}>
							Schrijf je in voor modules
          	</Typography>
						<Field
							label="filter"
							value={this.state.filterMethod}
							right
							editable
							options={[
								{ label: "Geen", value: "none" },
								{ label: "Blok 1", value: "period1" },
								{ label: "Blok 2", value: "period2" },
								{ label: "Blok 3", value: "period3" },
								{ label: "Blok 4", value: "period4" }]}
							onChange={(event) => { this.setState({ filterMethod: event.target.value }) }}
						/>
					</Toolbar>
				</Paper>
				<div style={{ display: "flex" }}>
					<Paper elevation={2}>
						<List component="nav" style={{ flex: 1 }}>
							<ListItem button onClick={() => {
								this.setState({
									sortMethod: "enrolled",
								})
							}} >
								<ListItemText>
									<Typography variant="title" color={this.state.sortMethod === "enrolled" ? "secondary" : "primary"}>
										Inschrijvingen
									</Typography>
								</ListItemText>
							</ListItem >
							{subjects}
						</List>
					</Paper>
					<div>
						{data}
					</div>
				</div>
				<br />
				<br />
				<br />
			</Page >
		);
	}
}

function mapStateToProps(state) {
	return {
		enrollableGroups: state.enrollableGroups,
		groups: state.groups,
		subjects: state.subjects ? state.subjects : [],
		enrolledGroupsIds: state.users[state.userId].enrollmentIds,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
		getGroups: () => dispatch(getGroups()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseSelect);


