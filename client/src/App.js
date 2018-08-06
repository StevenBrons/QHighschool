import React, { Component } from "react";
import {
	Route,
	Switch,
	Redirect,
	withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';

import { getSelf, addNotification } from './store/actions';

import Login from "./pages/Login";
import Settings from "./pages/Settings";
import CourseSelect from "./pages/CourseSelect";
import Group from "./pages/group/Group";

import Header from "./components/Header";
import NotificationBar from "./components/NotificationBar";
import Menu from "./components/Menu";

class App extends Component {

	componentWillMount() {
		this.props.getSelf();
	}

	handleShowMenu() {
		let showMenu = this.state.showMenu;
		this.setState({
			showMenu: !showMenu,
		});
	}

	render() {
		if (!this.props.userId) {
			return (
				<div className="App">
					<Header email="" />
					<NotificationBar />
				</div>
			);
		}
		return (
			<div className="App">
				<NotificationBar />
				{this.props.showMenu && <Menu />}
				<Header />
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/inschrijven" component={CourseSelect} />
					<Route path="/groep/:groupId" component={Group} />
					<Route path="/instellingen" component={Settings} />
					<Redirect push to={this.props.role === "student" ? "/inschrijven" : "/instellingen"} />
				</Switch>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		showMenu: state.showMenu,
		role: state.role,
		userId: state.userId,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getSelf: () => dispatch(getSelf()),
		addNotification: (notification) => dispatch(addNotification(notification)),
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
