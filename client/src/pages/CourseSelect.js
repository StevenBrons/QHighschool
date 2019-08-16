import React, { Component } from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';

import Page from './Page';
import Progress from '../components/Progress';
import Field from '../components/Field';
import Group from './group/Group';
import { getSubjects, getGroups, getEnrolLments } from '../store/actions';

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
			period: props.currentPeriod,
			leerjaar: "2019/2020",
			subject: null,
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let { blok, vak, leerjaar } = queryString.parse(nextProps.location.search);
		if (!vak && nextProps.subjects != null) {
			vak = nextProps.subjects[Object.keys(nextProps.subjects)[0]].name;
		}
		if (!blok) {
			blok = nextProps.enrollmentPeriod + "";
		}
		if (!leerjaar) {
			leerjaar = "2019/2020";
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
						<Field
							label="blok"
							value={this.state.period}
							editable
							style={{ flex: "none" }}
							options={[
								{ label: "Alle", value: "all" },
								{ label: "Blok 1", value: "1" },
								{ label: "Blok 2", value: "2" },
								{ label: "Blok 3", value: "3" },
								{ label: "Blok 4", value: "4" }]}
							onChange={this.handlePeriodChange}
						/>
						<Field
							label="leerjaar"
							style={{ flex: "none" }}
							value={this.state.schoolYear}
							editable
							options={[
								{ label: "Alle", value: "all" },
								{ label: "2016/2017", value: "2016/2017" },
								{ label: "2017/2018", value: "2017/2018" },
								{ label: "2018/2019", value: "2018/2019" },
								{ label: "2019/2020", value: "2019/2020" },
								{ label: "2020/2021", value: "2020/2021" },
								{ label: "2021/2022", value: "2021/2022" }]}
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
		enrolledGroupsIds: state.users[state.userId].enrollmentIds,
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


