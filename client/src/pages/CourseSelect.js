import React, { Component } from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';

import Page from './Page';
import Progress from '../components/Progress';
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
			sortSubjectId: -1,
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
				if (this.props.subjects == null || this.props.groups == null) {
					data = <Progress />
					break;
				}
				if (this.state.sortSubjectId === -1) {
					this.setState({
						sortSubjectId: Object.keys(this.props.subjects)[0],
					});
				}
				data = this.getGroupsPerSubject(this.state.sortSubjectId).sort((a, b) => { return a.period - b.period }).map((group) => {
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
			return (
				<ListItem button onClick={() => {
					this.setState({
						sortMethod: "subject",
						sortSubjectId: subject.id,
					})
				}} >
					<ListItemText>
						<Typography variant="title" color={(this.state.sortSubjectId + "" === "" + subject.id && this.state.sortMethod === "subject") ? "secondary" : "primary"}>
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
						<Typography variant="subheading" color="textSecondary">
							Schrijf je in voor modules
          	</Typography>
						{/* <form autoComplete="off" style={{ right: 10, position: "absolute" }}>
							<FormControl>
								<InputLabel htmlFor="sortMethod">Sorteren op</InputLabel>
								<Select
									value={this.state.sortMethod}
									onChange={this.handleSortChange}
									inputProps={{
										name: 'sortMethod',
										id: 'sortMethod',
									}}
									autoWidth={true}
									size={"large"}
								>
									<MenuItem value="subject">
										<Typography variant="subheading" color="textSecondary" style={{ width: "100px" }}>
											Vak
          					</Typography>
									</MenuItem>
									<MenuItem value={"enrollable"} style={{ width: "100px" }}>Inschrijfbaar</MenuItem>
								</Select>
							</FormControl>
						</form> */}
					</Toolbar>
				</Paper>
				<div style={{ display: "flex" }}>
					<Paper
						elevation={2}
					>
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


