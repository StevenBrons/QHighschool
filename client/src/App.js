import React, { Component } from "react";
import {
	Route,
	Switch,
	Redirect,
	withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';

import Data, { User } from "./Data";
import { getCookie, setCookie } from "./lib/Cookie";
import { getUser } from './store/actions';

import Login from "./pages/Login";
import Settings from "./pages/Settings";
import CourseSelect from "./pages/CourseSelect";
import Course from "./pages/Course";

import Header from "./components/Header";
import Menu from "./components/Menu";

class App extends Component {

	constructor(props) {
		super(props);
		const token = getCookie("token");
		Data.setToken(token);
		this.props.getUser();

		this.state = {
			showMenu: token ? true : false,
			token: token,
			user: {},
			choices: [],
			isLoggedIn: false,
			pages: [
				{
					id: "module-keuze",
					title: "Module keuze",
				},
				{
					id: "instellingen",
					title: "Instellingen",
					bottom: true,
				}
			],
		};

		if (token !== null) {
			User.getUser(this.state.token).then(data => {
				this.setState({
					user: data,
				});
			});
		}
	}

	handleLogin(event) {
		event.preventDefault();
		let token = "token1";
		Data.setToken(token);
		setCookie("token", token, 365);
		this.setState({ showMenu: true, token: token });
	}

	handleShowMenu() {
		let showMenu = this.state.showMenu;
		this.setState({
			showMenu: !showMenu,
		});
	}

	onSettingsSave(newUser) {
		this.setState({
			user: newUser,
		});
	}

	render() {
		if (this.state.token === null) {
			return (
				<div className="App" style={{ backgroundColor: "white" }}>
					<Header email="" />
					<Login handleLogin={this.handleLogin.bind(this)} />
				</div>
			);
		}
		return (
			<div className="App" style={{ backgroundColor: "white" }}>
				{this.props.showMenu && <Menu pages={this.state.pages} />}
				<Header email={this.state.user.preferedEmail} handleShowMenu={this.handleShowMenu.bind(this)} path={this.props.location} />
				<Switch>
					<Route path="/login" component={Login} />
					{!this.props.isLoggedIn && <Redirect to="/login" />}
					<Route path="/module-keuze" component={CourseSelect} />
					<Route path="/module" component={Course} />
					<Route path="/instellingen" component={Settings} />
					<Redirect push to="/module-keuze" />
				</Switch>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.isLoggedIn,
		showMenu: state.showMenu,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getUser: () => {
			dispatch(getUser());
		},

	};
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
