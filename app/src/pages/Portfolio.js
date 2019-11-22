import React, { Component } from "react";
import { connect } from "react-redux";
import map from "lodash/map";
import forEach from "lodash/forEach";

import Page from "./Page";
import Progress from "../components/Progress";
import Field from "../components/Field";
import Group from "./group/Group";
import {
  getSubjects,
  getGroups,
  getEnrolLments,
  getParticipatingGroups
} from "../store/actions";

import { Typography, Divider, Toolbar, Paper, Button } from "@material-ui/core";
import queryString from "query-string";

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
        <Field
          value={name}
          style={{ type: "headline", color: "secondary" }}
          layout={{ area: true }}
        />
        {groups}
        <Divider style={{ marginTop: "20px" }} />
      </div>
    );
  }

  openCertificate = () => {
    const userId = this.props.userId;

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      window.open(
        "http://localhost:26194/api/certificate/portfolio/" + userId,
        "_blank"
      );
    } else {
      window.open("/api/certificate/portfolio/" + userId, "_blank");
    }
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
              style={{ flex: "2 1 auto" }}
            >
              {this.props.role === "student" ? "Portfolio" : "Mijn groepen"}
            </Typography>
            {this.props.role === "student" && (
              <Button
                color="primary"
                variant="contained"
                style={{ margin: "20px" }}
                onClick={this.openCertificate}
              >
                Certificaat
              </Button>
            )}
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
                { label: "Blok 4", value: "4" }
              ]}
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
                { label: "2021/2022", value: "2021/2022" }
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
    userId: state.userId
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
