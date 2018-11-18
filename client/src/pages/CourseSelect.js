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
import queryString from "query-string";

class CourseSelect extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sortMethod: null,
			filterMethod: "none",
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		if (values.sort) {
			return {
				...prevState,
				...{
					sortMethod: values.sort,
					filterMethod: values.filter ? values.filter : "none",
				}
			}
		}
		if (prevState.sortMethod == null && nextProps.subjects != null) {
			return {
				...prevState,
				...{
					filterMethod: values.filter ? values.filter : "none",
					sortMethod: nextProps.subjects[Object.keys(nextProps.subjects)[0]].name,
				}
			};
		} else {
			return prevState;
		}
	}

	componentDidMount() {
		this.props.getSubjects();
		this.props.getGroups();
	}

	getGroupsPerSubject(subject) {
		return filter(this.props.groups, (group) => {
			return subject === group.subjectName;
		})
	}

	handleSortChange = subject => {
		this.props.history.push({
			search: "sort=" + subject + "&filter=" + this.state.filterMethod,
		});
	};

	handleFilterChange = event => {
		this.props.history.push({
			search: "sort=" + this.state.sortMethod + "&filter=" + event.target.value,
		});
	};

	getMenuItem(title, subject) {
		let color = (this.state.sortMethod === subject) ? "primary" : "default";
		return (
			<ListItem button onClick={() => this.handleSortChange(subject)} key={title}>
				<ListItemText>
					<Typography variant="title" color={color} style={{ minWidth: "150px" }}>
						{title}
					</Typography>
				</ListItemText>
			</ListItem >
		)
	}

	getMenuItems() {
		const subjectsComponents = map(this.props.subjects, (subject) => {
			return this.getMenuItem(subject.name, subject.name);
		});
		if (this.props.role === "student") {
			subjectsComponents.unshift(this.getMenuItem("Ingeschreven", "enrolled"));
		}
		return subjectsComponents;
	}

	render() {
		let data;
		if (this.state.sortMethod === "enrolled") {
			if (this.props.enrolledGroupsIds == null) {
				data = <Progress />
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
		} else {
			if (this.props.subjects == null || this.props.groups == null) {
				data = <Progress />
			}
			data = this.getGroupsPerSubject(this.state.sortMethod)
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
		}
		return (
			<Page>
				<Paper
					elevation={2}
					style={{ position: "relative" }}
				>
					<Toolbar style={{ display: "flex" }}>
						<Typography variant="subheading" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Schrijf je in voor modules
          	</Typography>
						<Field
							label="filter"
							value={this.state.filterMethod}
							editable
							options={[
								{ label: "Geen", value: "none" },
								{ label: "Blok 1", value: "period1" },
								{ label: "Blok 2", value: "period2" },
								{ label: "Blok 3", value: "period3" },
								{ label: "Blok 4", value: "period4" }]}
							onChange={this.handleFilterChange}
						/>
					</Toolbar>
				</Paper>
				<div style={{ display: "flex" }} className="ColumnFlexDirectionOnMobile">
					<Paper elevation={2}>
						<List component="nav" style={{ flex: 1 }}>
							{this.getMenuItems()}
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
		role: state.role,
		enrollableGroups: state.enrollableGroups,
		groups: state.groups,
		subjects: state.subjects,
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


