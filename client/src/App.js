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
import CourseSelect from "./pages/CourseSelect";
import Group from "./pages/group/Group";
import User from "./pages/user/User";
import DataPage from "./pages/DataPage";
import Taxi from "./pages/Taxi";

import Header from "./components/Header";
import NotificationBar from "./components/NotificationBar";
import Menu from "./components/Menu";
import Portfolio from "./pages/Portfolio";
import ControlPanel from "./pages/ControlPanel";
import Track from "./pages/track/Track";


class App extends Component {

	componentDidMount() {
		this.props.getSelf();
	}

	handleShowMenu() {
		let showMenu = this.state.showMenu;
		this.setState({
			showMenu: !showMenu,
		});
	}

	render() {
		if (!this.props.userId && this.props.location.pathname !== "/login") {
			return (
				<div className="App">
					<Header />
					<NotificationBar />
				</div>
			);
		}
		let startPage = "/groepen";
		if (this.props.role === "student") {
			startPage = "/aanbod";
		} else if (this.props.role === "grade_admin") {
			startPage = "/gegevens";
		}
		return (
			<div className="App">
				<NotificationBar />
				{this.props.showMenu && <Menu />}
				<Header />
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/aanbod" component={CourseSelect} />
					<Route path="/groep/:groupId" component={Group} />
					<Route path="/gebruiker/:userId" component={User} />
					<Route path="/profiel/" component={User} />
					<Route path="/portfolio/" component={Portfolio} />
					<Route path="/groepen/" component={Portfolio} />
					<Route path="/gegevens/" component={DataPage} />
					<Route path="/taxi/" component={Taxi} />
					<Route path="/beheer/" component={ControlPanel} />
					<Route path="/parcours/" component={Track} />
					<Redirect push to={this.props.role === "student" ? "/aanbod" : "/groepen"} />
					<Redirect push to={startPage} />
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
