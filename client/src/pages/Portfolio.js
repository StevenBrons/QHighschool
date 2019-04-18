import React, { Component } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import forEach from 'lodash/forEach';

import Page from './Page';
import Progress from '../components/Progress';
import Field from '../components/Field';
import Group from './group/Group';
import { getSubjects, getGroups, getEnrolLments, getParticipatingGroups } from '../store/actions';

import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import queryString from "query-string";

class Portfolio extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let values = queryString.parse(nextProps.location.search);
		if (values.filter) {
			return {
				...prevState,
				filter: values.filter
			}
		} else {
			return {
				...prevState,
				filter: "all"
			};
		}
	}

	handleFilterChange = event => {
		this.props.history.push({
			search: "filter=" + event.target.value,
		});
	};

	orderGroups(groups, compareFunction) {
		let orders = {};
		forEach(groups, group => {
			if (!orders[compareFunction(group)]) {
				orders[compareFunction(group)] = [];
			}
			orders[compareFunction(group)].push(group);
		});
		return map(orders, this.getOrder);
	}

	getOrder(groups, name) {
		groups = map(groups, group =>
			<Group key={group.id}
				groupId={group.id}
				display="card" />
		);

		return <div key={name} style={{ padding: "10px" }}>
			<Field value={name} style={{ type: "headline", color: "secondary" }} layout={{ area: true }} />
			{groups}
			<Divider style={{ marginTop: "20px" }} />
		</div>
	}

	render() {
		let groupIds = [];
		if (!this.props.groups) {
			this.props.getParticipatingGroups();
		}

		let options = [ { label: "Alle", value: "all" }, {label: "Blok 1", value: "period1"},  {label: "Blok 2", value: "period2"}, {label: "Blok 3", value: "period3"}, {label: "Blok 4", value: "period4"}];
		if ( this.props.role === "student" ) 
			options.splice(1,0,{ label: "Ingeschreven", value: "enrolled" });


		switch (this.state.filter) {
			case "all":
				if (!this.props.enrollmentIds) {
					this.props.getEnrolLments();
				}
				groupIds = this.props.participatingGroupIds.concat(this.props.enrollmentIds || []);
				break;
			case "enrolled":
				if (!this.props.enrollmentIds) {
					this.props.getEnrolLments();
				}
				groupIds = this.props.enrollmentIds;
				break;
			case "period1":
			case "period2":
			case "period3":
			case "period4":
			default:
				break;
		}

		let content;
		if (!this.props.groups || groupIds.filter(id => this.props.groups[id] == null).length !== 0) {
			content = <Progress />;
		} else {
			content = this.orderGroups(groupIds.map(id => this.props.groups[id]), function (group) {
				return group.subjectName;
			});
		}

		return <Page>
			<Paper
				elevation={2}
				style={{ position: "relative" }}
			>
				<Toolbar style={{ display: "flex" }}>
					<Field value="Portfolio" style={{ type: "headline", flex: 3 }} />
					<Field
						label="filter"
						value={this.state.filter}
						editable
						options={options}
						onChange={this.handleFilterChange}
					/>
				</Toolbar>
			</Paper>
			{content}
		</Page>;
	}

}

function mapStateToProps(state) {
	return {
		groups: state.groups,
		participatingGroupIds: state.users[state.userId].participatingGroupIds,
		enrollmentIds: state.users[state.userId].enrollmentIds,
		role: state.role,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
		getGroups: () => dispatch(getGroups()),
		getEnrolLments: () => dispatch(getEnrolLments()),
		getParticipatingGroups: () => dispatch(getParticipatingGroups()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);


