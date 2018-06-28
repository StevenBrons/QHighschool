import React, { Component } from "react";
import {connect} from "redux";

import GroupCard from "./GroupCard";
import {setGroup} from "../store/actions"

class Group extends Component {

  render() {

    switch(this.props.display){
      case "page":
      return (
        <GroupCard {...this.props} />
      );
      case "Card":
      default:
      return (
        <GroupCard {...this.props} />
      );
    }
  }
}


function mapStateToProps(state, ownProps) {
  if (state.groups == null) {
    return {
      loading:true,
      group:{}
    }
  }
  const groups = state.groups.filter((g) => g.id === ownProps.groupId);
  if (groups.length !== 1) {
    return {
      group:true,
    }
  }
  return {
    group:groups[0],
  }
}

function mapDispatchToProps(dispatch) {
	return {
		setGroup: (group) => dispatch(setGroup(group)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Group);
