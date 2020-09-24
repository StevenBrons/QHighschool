import React, { Component } from "react";
import { connect } from "react-redux";
import map from "lodash/map";

import SelectField from "./SelectField";
import { getAllUsers } from "../store/actions";

class SelectUser extends Component {

  componentDidMount() {
    this.props.getAllUsers();
  }

  render() {
    const options = map(this.props.users,({displayName, id}) => {
      return {
        label: displayName,
        value: id,
      }
    });
    return <SelectField 
      label="Gebruiker"
      options={options}
      value={this.props.value}
      editable
      onChange={this.props.onChange}
    />
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

