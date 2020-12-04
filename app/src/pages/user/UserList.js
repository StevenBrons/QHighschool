import React, { Component } from "react";
import { connect } from "react-redux";
import InputField from "../../fields/InputField"
import { Typography, Tooltip, TableSortLabel, Paper, Button } from "@material-ui/core";
import UserRow from "./UserRow"

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      filter: "",
      sortValue: "",
      sortDirection: ""
    };
  }

  onSortChange = value => {
    this.setState({
      sortValue: value,
      sortDirection:
        this.state.sortDirection === "desc" && this.state.sortValue === value
          ? "asc"
          : "desc"
    });
  };

  headerTitle(variant, value, title) {
    let sortValue = this.state.sortValue;
    let sortDirection = this.state.sortDirection === "asc" ? "asc" : "desc";
    return (
      <Typography
        variant={variant}
        color={variant === "button" ? "primary" : "initial"}
        style={{ flex: 1 }}
      >
        <Tooltip title="Sorteer" enterDelay={300} placement="bottom-start">
          <TableSortLabel
            active={sortValue === value}
            direction={sortDirection}
            onClick={() => this.onSortChange(value)}
            style={{ color: "inherit" }}
          >
            {title}
          </TableSortLabel>
        </Tooltip>
      </Typography>
    );
  }

  getHeader = () => {
    let style = {
      width: "100%",
      height: "auto",
      margin: "0px",
      padding: "10px",
      backgroundColor: "#e0e0e0"
    };
    let isExtendedUser = this.props.role === "admin";

    return (
      <tr key="header">
        <Paper
          elevation={this.state.hover ? 2 : 1}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
          component="td"
          style={style}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            {this.headerTitle("button", "name", "Naam")}
            {this.headerTitle("subtitle1", "school", "School")}
            {this.headerTitle("body1", "role", "Rol")}
            {this.headerTitle("body1", "id", "Gebruikers ID")}
          </div>
          {isExtendedUser ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              {this.headerTitle("body1", "preferedEmail", "Voorkeurs email")}
              {this.headerTitle("body1", "levelAndYear", "Niveau - Leerjaar")}
              {this.headerTitle("body1", "profile", "Profiel")}
              {this.headerTitle("body1", "phoneNumber", "Telefoonnummer")}
            </div>
          ) : null}
        </Paper>
      </tr>
    );
  };

  getFilters = () => {
    return <InputField
      variant="outlined"
      value={this.state.filter}
      td
      label="Zoek"
      onChange={(filter) => this.setState({ filter })}
    />;
  }

  sortAndFilterIds = () => {
    const value = this.state.sortValue;
    const direction = this.state.sortDirection;
    const users = this.props.users;
    const userIds = this.props.userIds;
    return userIds
      .filter(id => {
        if (users[id] == null) return false;
        const name = (users[id]["displayName"] + "").toLowerCase();
        const filter = this.state.filter.toLowerCase();
        return name.includes(filter);
      })
      .sort((a, b) => {
        switch (value) {
          case "name":
            a = users[a]["displayName"];
            b = users[b]["displayName"];
            break;
          case "levelAndYear":
            a = (users[a]["level"] + users[a]["year"]).toString(); // to string because otherwise no level and year would result in a being an integer
            b = (users[b]["level"] + users[b]["year"]).toString();
            break;
          default:
            a = users[a][value];
            b = users[b][value];
        }
        let cmp = (b == null) - (a == null) || +(a > b) || -(a < b);
        return direction === "asc" ? cmp : -cmp;
      });
  };

  getUserRow = (userId) => {
    let children;
    if (this.props.actions) {
      children = this.props.actions.map(({ label, onClick }, i) => {
        return <Button key={i} onClick={() => onClick(userId)} variant="contained" color="primary">{label}</Button>
      });
    }
    return <UserRow
      key={userId}
      userId={userId}
      actions={this.props.actions} >
      {children}
    </UserRow>
  }

  render() {
    const header = this.getHeader();
    const users = this.sortAndFilterIds().map(this.getUserRow);
    const filters = this.props.userIds.length > 50 ? this.getFilters() : null;
    return (
      <table style={{ width: "100%" }}>
        <tbody>
          {header}
          <tr>
            {filters}
          </tr>
          {users}
        </tbody>
      </table>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    users: state.users,
    role: state.role,
    userIds: ownProps.userIds,
    actions: ownProps.actions,
  };
}

export default connect(mapStateToProps)(UserList);
