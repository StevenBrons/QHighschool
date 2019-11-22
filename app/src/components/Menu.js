import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AssessmentIcon from "@material-ui/icons/Assessment";
import AssignmentIcon from "@material-ui/icons/Assignment";
import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import ExitIcon from "@material-ui/icons/ExitToApp";
import LocalTaxiIcon from "@material-ui/icons/LocalTaxi";
import BuildIcon from "@material-ui/icons/Build";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import NotificationBadge from "./NotificationBadge";

import Paper from "@material-ui/core/Paper";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import theme from "../lib/MuiTheme";
import $ from "jquery";

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    switch (this.props.role) {
      case "student":
        this.state.pages = ["aanbod", "portfolio", "profiel", "loguit"];
        break;
      case "teacher":
        this.state.pages = ["aanbod", "groepen", "profiel", "loguit"];
        break;
      case "admin":
        this.state.pages = [
          "groepen",
          "aanbod",
          "profiel",
          "gegevens",
          "taxi",
          "beheer",
          "loguit"
        ];
        break;
      case "grade_admin":
        this.state.pages = [
          "aanbod",
          "groepen",
          "gegevens",
          "taxi",
          "profiel",
          "loguit"
        ];
        break;
      default:
        this.state.pages = ["aanbod", "profiel", "loguit"];
        break;
    }
  }

  logout() {
    return $.ajax({
      url: "/auth/logout",
      type: "get",
      dataType: "json"
    }).then(() => {
      document.location.reload();
    });
  }

  onClick(page) {
    if (page === "loguit") {
      this.logout();
    } else {
      this.props.history.push("/" + page);
    }
  }

  getIcon(iconName, color) {
    let c = "black";
    if (theme.palette[color]) {
      c = theme.palette[color].main;
    }
    switch (iconName) {
      case "Assignment":
        return <AssignmentIcon style={{ color: c }} />;
      case "Group":
        return <GroupIcon style={{ color: c }} />;
      case "Assessment":
        return <AssessmentIcon style={{ color: c }} />;
      case "Person":
        return <PersonIcon style={{ color: c }} />;
      case "ViewColumn":
        return <ViewColumnIcon style={{ color: c }} />;
      case "Exit":
        return <ExitIcon color="secondary" />;
      case "Taxi":
        return <LocalTaxiIcon style={{ color: c }} />;
      case "Beheer":
        return <BuildIcon style={{ color: c }} />;
      default:
        return null;
    }
  }

  getItem(page, index) {
    const isCurrentPage = "/" + page.id === this.props.location.pathname;
    let style = {};
    if (page.bottom) {
      style.position = "absolute";
      style.bottom = "0px";
    }

    const color = isCurrentPage ? "primary" : "inherit";
    const icon = (
      <ListItemIcon>
        <NotificationBadge scope={page.id}>
          {this.getIcon(page.icon, color)}
        </NotificationBadge>
      </ListItemIcon>
    );
    return (
      <ListItem
        key={index}
        button
        onClick={() => this.onClick(page.id)}
        style={style}
      >
        {icon}
        <Typography variant="button" color={color} className="HiddenOnMobile">
          {page.title}
        </Typography>
      </ListItem>
    );
  }

  render() {
    const pages = [
      {
        id: "aanbod",
        title: "Aanbod",
        icon: "Assignment"
      },
      {
        id: "groepen",
        title: "Mijn groepen",
        icon: "Group"
      },
      {
        id: "portfolio",
        title: "Portfolio",
        icon: "Assessment"
      },
      {
        id: "gegevens",
        title: "Gegevens",
        icon: "ViewColumn" // table_chart is more appropriate
      },
      {
        id: "taxi",
        title: "Taxi",
        icon: "Taxi"
      },
      {
        id: "beheer",
        title: "Beheer",
        icon: "Beheer"
      }
    ];

    const profile = [
      {
        id: "profiel",
        title: "Profiel",
        icon: "Person"
      },
      {
        id: "loguit",
        title: "Log uit",
        icon: "Exit"
      }
    ];

    const visiblePages = pages
      .filter(page => this.state.pages.indexOf(page.id) !== -1)
      .map(this.getItem.bind(this));

    const visibleProfile = profile
      .filter(page => this.state.pages.indexOf(page.id) !== -1)
      .map(this.getItem.bind(this));

    return (
      <Paper elevation={8} className="Menu">
        <List component="nav" style={{ height: "100%" }}>
          {visiblePages}
          <div style={{ position: "absolute", bottom: "20px", width: "100%" }}>
            {visibleProfile}
          </div>
        </List>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  if (state.userId != null) {
    return {
      displayName: state.users[state.userId].displayName,
      userId: state.userId,
      role: state.role
    };
  }
  return {
    displayName: "",
    userId: state.userId,
    role: state.role
  };
}

export default withRouter(connect(mapStateToProps, null)(Menu));
