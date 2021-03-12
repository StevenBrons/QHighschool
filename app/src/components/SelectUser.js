import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import filter from "lodash/filter";
import { ClickAwayListener } from "@material-ui/core";

import Field from "./Field";
import { getAllUsers } from "../store/actions";

class SelectUser extends Component {
  constructor(props) {
    super(props);
    this.myref = this.state = {
      input: "",
      userId: null,
      open: false,
      id: "SelectUser" + Math.floor(Math.random() * 1000)
    };
  }

  componentDidMount() {
    this.props.getAllUsers();
  }

  selectUser = (userId, displayName) => {
    this.setState({
      input: displayName,
      open: false,
      userId: userId
    });
    this.props.onChange(userId, displayName);
  };

  getFittingUsers = () => {
    const regExp = new RegExp(this.state.input.toLowerCase());
    let count = 0;
    return filter(this.props.users, user => {
      const v = regExp.test(user.displayName.toLowerCase());
      if (v) {
        count++;
      }
      return v && count < 6;
    }).map(user => {
      return (
        <MenuItem
          key={user.id + user.displayName}
          onClick={() => this.selectUser(user.id, user.displayName)}
        >
          {user.displayName}
        </MenuItem>
      );
    });
  };

  handleInput = value => {
    if (this.state.userId) {
      this.props.onChange(null, null);
    }
    this.setState({
      input: value,
      open: true,
      userId: null
    });
  };

  render() {
    return (
      <ClickAwayListener onClickAway={() => this.setState({ open: false })}>
        <span>
          <Field
            label="Gebruiker"
            value={this.state.input}
            editable
            onChange={this.handleInput}
            style={{ margin: "normal" }}
            id={this.state.id}
          />
          <Popper
            open={this.state.aliasId == null && this.state.open}
            disablePortal
            anchorEl={document.getElementById(this.state.id)}
            style={{ position: "fixed", zIndex: "10000" }}
          >
            <Paper>
              <MenuList>{this.getFittingUsers()}</MenuList>
            </Paper>
          </Popper>
        </span>
      </ClickAwayListener>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getAllUsers: () => dispatch(getAllUsers())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectUser);
