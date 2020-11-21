import { Paper, Toolbar, Typography } from "@material-ui/core";
import { map } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Page from '../Page';
import UserList from "./UserList";
import { getAllUsers } from "../../store/actions";

class UserListPage extends Component {

	componentDidMount() {
		this.props.getAllUsers();
	}

	render() {
		return <Page>
			<Paper style={{ position: "relative" }} >
				<Toolbar style={{ display: "flex" }} >
					<Typography variant="subtitle1" color="textSecondary" style={{ flex: "2 1 auto" }}>
						Gebruikers
          </Typography>
				</Toolbar>
			</Paper>
			<UserList userIds={this.props.userIds}>
			</UserList>
		</Page>
	}

}



function mapStateToProps(state, ownProps) {
	return {
		userIds: map(state.users, (user) => user.id)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getAllUsers: () => dispatch(getAllUsers()),
	};
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserListPage));