import React, { Component } from "react";
import { connect } from "react-redux";
import map from "lodash/map";
import forEach from "lodash/forEach";

import Page from "./Page";
import Progress from "../components/Progress";
import Group from "./group/Group";
import { getEnrolLments, getGroups, getParticipatingGroups, getSubjects } from "../store/actions";

import { Divider, Paper, Toolbar, Typography } from "@material-ui/core";
import queryString from "query-string";
import SelectField from "../fields/SelectField";

class Portfolio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			period: props.currentPeriod + "",
			leerjaar: props.role === "student" ? "all" : props.schoolYear
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let { blok, leerjaar } = queryString.parse(nextProps.location.search);
		if (!blok) {
			blok =
				nextProps.role === "student" ? "all" : nextProps.currentPeriod + "";
		}
		if (!leerjaar) {
			leerjaar = nextProps.role === "student" ? "all" : nextProps.schoolYear;
		}
		return {
			...prevState,
			period: blok,
			schoolYear: leerjaar
		};
	}

	handlePeriodChange = period => {
		this.props.history.push({
			search: `blok=${period}&leerjaar=${this.state.leerjaar}`
		});
	};

	handleYearChange = schoolYear => {
		this.props.history.push({
			search: `blok=${this.state.period}&leerjaar=${schoolYear}`
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
		groups = map(groups, group => (
			<Group key={group.id} groupId={group.id} display="card" />
		));

		return (
			<div key={name} style={{ padding: "10px" }}>
				<Typography
					color="secondary"
					variant="h6"
				>
					{name}
				</Typography>
				{groups}
				<Divider style={{ marginTop: "20px" }} />
			</div>
		);
	}

	openCertificate = () => {
		window.open("/certificaat/gebruiker/" + this.props.userId.toString(), "_blank");
	};

	render() {
		let options = [
			{ label: "Alle", value: "all" },
			{ label: "Blok 1", value: "period1" },
			{ label: "Blok 2", value: "period2" },
			{ label: "Blok 3", value: "period3" },
			{ label: "Blok 4", value: "period4" }
		];
		if (this.props.role === "student") {
			options.splice(1, 0, { label: "Ingeschreven", value: "enrolled" });
		}

		if (!this.props.groups) {
			this.props.getParticipatingGroups();
		}
		if (!this.props.enrollmentIds) {
			this.props.getEnrolLments();
		}

		let groupIds = this.props.enrollmentIds || [];
		if (this.state.filter !== "enrolled") {
			/* If filter is not equal to enrolled, participating ids need to be added.
			From participating ids we first remove the ones that are already in enrolled ids.
			Finally, after adding participating ids, we filter on period */
			groupIds = this.props.participatingGroupIds
				.filter(id => {
					return groupIds.indexOf(id) === -1;
				})
				.concat(groupIds);
		}

		let content;
		if (
			this.props.groups == null ||
			Object.keys(this.props.groups).length === 0
		) {
			content = <Progress />;
		} else {
			const groups = groupIds
				.map(id => this.props.groups[id])
				.filter(group => group != null)
				.filter(group => {
					if (this.state.period !== "all") {
						return group.period + "" === this.state.period;
					} else {
						return true;
					}
				})
				.filter(group => {
					if (this.state.schoolYear !== "all") {
						return group.schoolYear + "" === this.state.schoolYear;
					} else {
						return true;
					}
				});
			content = this.orderGroups(groups, group => {
				return group.subjectName;
			});
		}

		return (
			<Page>
				<Paper elevation={2} style={{ position: "relative" }}>
					<Toolbar style={{ display: "flex" }}>
						<Typography
							variant="subtitle1"
							color="textSecondary"
							style={{ flex: "4 1 auto" }}
						>
							{this.props.role === "student" ? "Portfolio" : "Mijn groepen"}
						</Typography>
						{/* {this.props.role === "student" && (
														<Button
																color="primary"
																variant="contained"
																style={{margin: "20px"}}
																onClick={this.openCertificate}
														>
																Certificaat
														</Button>
												)} */}
						<SelectField
							label="blok"
							style={{ flex: 1 }}
							value={this.state.period}
							options={[
								{ label: "Alle", value: "all" },
								{ label: "Blok 1", value: "1" },
								{ label: "Blok 2", value: "2" },
								{ label: "Blok 3", value: "3" },
								{ label: "Blok 4", value: "4" }
							]}
							onChange={this.handlePeriodChange}
						/>
						<SelectField
							label="schooljaar"
							style={{ flex: 1 }}
							value={this.state.schoolYear}
							options={[
								{ label: "Alle", value: "all" },
								...this.props.possibleYears.map((year) => { return { label: year, value: year } })
							]}
							onChange={this.handleYearChange}
						/>
					</Toolbar>
				</Paper>
				{content}
			</Page>
		);
	}
}

function mapStateToProps(state) {
	return {
		groups: state.groups,
		participatingGroupIds: state.users[state.userId].participatingGroupIds,
		enrollmentIds: state.users[state.userId].enrollmentIds,
		role: state.role,
		schoolYear: state.schoolYear,
		currentPeriod: state.currentPeriod,
		userId: state.userId,
		possibleYears: state.possibleYears,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
		getGroups: () => dispatch(getGroups()),
		getEnrolLments: () => dispatch(getEnrolLments()),
		getParticipatingGroups: () => dispatch(getParticipatingGroups())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
