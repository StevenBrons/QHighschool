import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import Data, { User } from "./Data";
import {getCookie,setCookie} from "./lib/Cookie";

import Login from "./pages/Login";
import Settings from "./pages/Settings";
import CourseSelect from "./pages/CourseSelect";

import Header from "./components/Header";
import Menu from "./components/Menu";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#5472d3',
			main: '#0d47a1',
			dark: '#002171',
			contrastText: '#fff',
		},
		secondary: {
			light: '#60ad5e',
			main: '#2e7d32',
			dark: '#005005',
			contrastText: '#ffffff',
		},
	},
});

class App extends Component {

	constructor(props) {
		super(props);
		const token = getCookie("token");
		Data.setToken(token);

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
			<MuiThemeProvider theme={theme}>
				<Router>
					<div className="App" style={{ backgroundColor: "white" }}>
						{
							this.state.showMenu ? <Menu pages={this.state.pages} /> : null
						}
						<Header email={this.state.user.preferedEmail} handleShowMenu={this.handleShowMenu.bind(this)} path={this.props.location} />
						<Switch>
							<Route path="/module-keuze" component={CourseSelect} />
							<Route path="/instellingen" render={() => {
								return (<Settings onSave={this.onSettingsSave.bind(this)} user={this.state.user}/>);
							}} />
							<Redirect to="/module-keuze" />
						</Switch>
					</div>
				</Router>
			</MuiThemeProvider>
		);
	}

}

export default App;
