import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import theme from '../lib/MuiTheme';
import { toggleMenu } from '../store/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		this.generateEmail.bind(this)();
		this.interval = setInterval(this.generateEmail.bind(this), 1500);
	}

	generateEmail() {
		let school = this.state.school;
		let schoolShort = this.state.schoolShort;
		let studentNumber = this.state.studentNumber;
		switch (Math.floor(Math.random() * 14)) {
			case 0:
				school = "beekdallyceum";
				schoolShort = "BD";
				break;
			case 1:
				school = "candea";
				schoolShort = "CC";
				break;
			case 2:
				school = "quadraam";
				schoolShort = "CB";
				break;
			case 3:
				school = "lyceumelst";
				schoolShort = "LE";
				break;
			case 4:
				school = "liemerscollege";
				schoolShort = "LC";
				break;
			case 5:
				school = "lorentzlyceum";
				schoolShort = "LL";
				break;
			case 6:
				school = "maartenvanrossem";
				schoolShort = "MvR";
				break;
			case 7:
				school = "montessoriarnhem";
				schoolShort = "MC";
				break;
			case 8:
				school = "olympuscollege";
				schoolShort = "OC";
				break;
			case 9:
				school = "produsarnhem";
				schoolShort = "PD";
				break;
			case 10:
				school = "gymnasiumarnhem";
				schoolShort = "SGA";
				break;
			case 11:
				school = "symbion";
				schoolShort = "SY";
				break;
			case 12:
				school = "vmbo-venster";
				schoolShort = "VE";
				break;
			case 13:
			default:
				school = "hetwesteraam";
				schoolShort = "HW";
				break;
		}
		studentNumber = Math.floor(Math.random() * 999999) + "";
		for (let i = studentNumber.length; i < 6; i++) {
			studentNumber = "0" + studentNumber;
		}
		this.setState({
			school,
			schoolShort,
			studentNumber,
		});
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	login() {
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			document.location.href = "localhost:26194/auth/login"
		} else {
			document.location.href = "/auth/login"
		}
	}

	generateColoredEmail(schoolShort, studentNumber, school) {
		return (
			<Typography variant="subheading" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
				<span style={{ color: theme.palette.secondary.light, fontWeight: "bold" }}>
					{schoolShort}
				</span>
				<span style={{ color: theme.palette.secondary.dark, fontWeight: "bolder" }}>
					{studentNumber}
				</span>
				<span style={{ fontWeight: "bold" }}>
					@ll.
				</span>
				<span style={{ color: theme.palette.secondary.light, fontWeight: "bold" }}>
					{school}
				</span>
				<span style={{ fontWeight: "bold" }}>
					.nl
				</span>
			</Typography>
		)
	}

	render() {
		if (this.props.userId != null) {
			this.props.history.push("/");
			this.props.toggleMenu(true);
		} else {
			this.props.toggleMenu(false);
		}

		return (
			<Paper elevation={8} className="Login">
				<div style={{ padding: "20px" }}>
					<Typography gutterBottom variant="headline" color="primary">
						Log in
					</Typography>
					<Typography variant="subheading">
						Gebruik je school-email om in te loggen:
					</Typography>
					<br />
					<br />
					<center>
						{this.generateColoredEmail("schoolafkorting", "leerlingnummer", "school")}
						{this.generateColoredEmail(this.state.schoolShort, this.state.studentNumber, this.state.school)}
					</center>
					<br />
					<br />
					<Button type="submit" variant="contained" size="large" color="primary" fullWidth onClick={this.login}>
						Login met je Microsoft school account
					</Button>
				</div>
			</Paper >
		);
	}
}


function mapStateToProps(state) {
	return {
		userId: state.userId,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		login: (email, password) => {
			dispatch(toggleMenu(true));
		},
		toggleMenu: (state) => {
			dispatch(toggleMenu(state));
		},
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));



