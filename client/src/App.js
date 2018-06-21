import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import { User } from "./Data";

import "./style.css";
import "./layout.css";

import Login from "./pages/Login";
import Settings from "./pages/Settings";
import CourseSelect from "./pages/CourseSelect";

import Header from "./components/Header";
import Menu from "./components/Menu";

class App extends Component {

	constructor(props) {
		super(props);
		const token = getCookie("token");

		this.state = {
			showMenu: token ? true : false,
			token: token,
			user: {},
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
		setCookie("token", token, 365);
		this.setState({ showMenu: true, token: token });
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
			<Router>
				<div className="App" style={{ backgroundColor: "white" }}>
					<Header email={this.state.user.email} />
					{
						this.state.showMenu ? <Menu pages={this.state.pages} /> : null
					}
					<Switch>
						<Route path="/module-keuze" render={()=><CourseSelect token={this.state.token}/>}/>
						<Route path="/instellingen" component={Settings} />
						<Redirect to="/module-keuze" />
					</Switch>
				</div>
			</Router>

		);
	}

}


function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export default App;
