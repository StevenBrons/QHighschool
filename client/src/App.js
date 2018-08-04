import React, { Component } from "react";
import {
	Route,
	Switch,
	Redirect,
	withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';

import Data from "./lib/Data";
import { getUser } from './store/actions';

import Login from "./pages/Login";
import Settings from "./pages/Settings";
import CourseSelect from "./pages/CourseSelect";
import Group from "./pages/group/Group";

import Header from "./components/Header";
import NotificationBar from "./components/NotificationBar";
import Menu from "./components/Menu";

class App extends Component {

	constructor(props) {
		super(props);
		Data.setToken(this.props.token);
		this.props.getUser();
	}

	handleShowMenu() {
		let showMenu = this.state.showMenu;
		this.setState({
			showMenu: !showMenu,
		});
	}

	render() {
		if (this.props.role == null && this.props.token != null) {
			return (
				<div className="App" style={{ backgroundColor: "white" }}>
					<Header email="" />
				</div>
			);
		}
		return (
			<div className="App" style={{ backgroundColor: "white" }}>
				{this.props.showMenu && <Menu/>}
				<NotificationBar/>
				<Header/>
				<Switch>
					<Route path="/login" component={Login} />
					{ (this.props.token == null) && <Redirect to="/login" />}
					<Route path="/inschrijven" component={CourseSelect} />
					<Route path="/groep/:groupId" component={Group} />
					<Route path="/instellingen" component={Settings} />
					<Redirect push to={this.props.role==="student"?"/inschrijven":"/instellingen"} />
				</Switch>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		token: state.token,
		showMenu: state.showMenu,
		role: state.role,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getUser: () => dispatch(getUser()),
		setToken: (token) => dispatch({
			type:"SET_TOKEN",
			token: token,
		}),
	};
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
