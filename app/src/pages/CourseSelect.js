import React, { Component } from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';

import Page from './Page';
import Progress from '../components/Progress';
import Group from './group/Group';
import { getSubjects, getGroups, getEnrolLments } from '../store/actions';

import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import queryString from "query-string";
import SelectField from '../fields/SelectField';

class CourseSelect extends Component {

	constructor(props) {
		super(props);
		this.state = {
			period: props.currentPeriod,
			leerjaar: props.schoolYear,
			subject: null,
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let { blok, vak, leerjaar } = queryString.parse(nextProps.location.search);
		if (!vak && nextProps.subjects != null) {
			const normalSubjects = filter(nextProps.subjects, subject => subject.name[0] !== "@");
			vak = normalSubjects[0].name;
		}
		if (!blok) {
			blok = nextProps.enrollmentPeriod + "";
		}
		if (!leerjaar) {
			leerjaar = nextProps.schoolYear;
		}
		return {
			...prevState,
			period: blok,
			subject: vak,
			schoolYear: leerjaar,
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
			search: `vak=${subject}&blok=${this.state.period}&leerjaar=${this.state.schoolYear}`,
		});
	};

	handlePeriodChange = period => {
		this.props.history.push({
			search: `vak=${this.state.subject}&blok=${period}&leerjaar=${this.state.schoolYear}`,
		});
	};

	handleYearChange = schoolYear => {
		this.props.history.push({
			search: `vak=${this.state.subject}&blok=${this.state.period}&leerjaar=${schoolYear}`,
		});
	};

	getMenuItem(title, subject) {
		let color = (this.state.subject === subject) ? "primary" : "initial";
		return (
			<ListItem button onClick={() => this.handleSortChange(subject)} key={title}>
				<ListItemText>
					<Typography variant="button" color={color} style={{ minWidth: "150px" }}>
						{title}
					</Typography>
				</ListItemText>
			</ListItem >
		)
	}

	getMenuItems() {
		const role = this.props.role;
		let subjects = map(this.props.subjects, subject => subject);
		if (role !== "admin") {
			subjects = subjects.filter(subject => subject.name[0] !== "@");
		}
		let subjectsComponents = subjects.map(subject => this.getMenuItem(subject.name, subject.name));
		if (role === "student") {
			subjectsComponents.unshift(this.getMenuItem("Ingeschreven", "enrolled"));
		}
		return subjectsComponents;
	}

	render() {
		let data;
		if (this.state.subject === "enrolled") {
			if (this.props.enrolledGroupsIds == null) {
				data = <Progress />;
				this.props.getEnrolLments();
			} else {
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
			}
		} else {
			if (this.props.subjects == null || this.props.groups == null || this.props.enrolledGroups === []) {
				data = <Progress />
			}
			data = this.getGroupsPerSubject(this.state.subject)
				.filter((group) => group != null)
				.filter((group) => {
					if (this.state.period !== "all") {
						return group.period + "" === this.state.period;
					} else {
						return true;
					}
				})
				.filter((group) => {
					if (this.state.schoolYear !== "all") {
						return group.schoolYear + "" === this.state.schoolYear;
					} else {
						return true;
					}
				})
				.sort((a, b) => a.period - b.period)
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
				<Paper style={{ position: "relative" }} >
					<Toolbar style={{ display: "flex" }} >
						<Typography variant="subtitle1" color="textSecondary" style={{ flex: "2 1 auto" }}>
							Schrijf je in voor modules
          	</Typography>
						<SelectField
							label="blok"
							value={this.state.period}
							options={[
								{ label: "Alle", value: "all" },
								{ label: "Blok 1", value: "1" },
								{ label: "Blok 2", value: "2" },
								{ label: "Blok 3", value: "3" },
								{ label: "Blok 4", value: "4" }]}
							onChange={this.handlePeriodChange}
						/>
						<SelectField
							value={this.state.schoolYear}
							label="schooljaar"
							options={[
								{ label: "Alle", value: "all" },
								...this.props.possibleYears.map((year) => { return { label: year, value: year } })
							]}
							style={{ flex: "1", marginLeft: "20px" }}
							onChange={this.handleYearChange}
						/>
					</Toolbar>
				</Paper>
				<div style={{ display: "flex" }} className="ColumnFlexDirectionOnMobile">
					<Paper>
						<List component="nav" style={{ flex: 1 }}>
							{this.getMenuItems()}
						</List>
					</Paper>
					<div style={{ padding: "12px" }}>
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
		enrollmentPeriod: state.enrollmentPeriod,
		enrollableGroups: state.enrollableGroups,
		groups: state.groups,
		subjects: state.subjects,
		schoolYear: state.schoolYear,
		enrolledGroupsIds: state.users[state.userId].enrollmentIds,
		possibleYears: state.possibleYears,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
		getGroups: () => dispatch(getGroups()),
		getEnrolLments: () => dispatch(getEnrolLments()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseSelect);


