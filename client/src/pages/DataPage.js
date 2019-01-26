import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import Progress from '../components/Progress';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: null,
		};
	}

	render() {
		//<TEMP>
		const dropDownOption = "user_data"; // or "evaluations", or "enrollments"
		//</TEMP>

		//use this function to fetch the data
		this.props.fetchData(dropDownOption).then(data => this.setState({ data: data }));

		return (
			<Paper elevation={8} className="Login">
				{this.state.data == null ? <Progress /> : null}
			</Paper >
		);
	}
}


function mapStateToProps(state) {
	return {
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchData: async (table) => {
			//feel free to create some better test-data, (to test responsiveness, and, potentialy 12+ columns!)
			switch (table) {
				case "user_data":
					return [
						["displayName", "firstName", "lastName", "role"],
						["B, Steven", "Steven", "B", "admin"],
						["Doe, Jon", "Jon", "Doe", "student"]
						["B, Steven", "Steven", "B", "admin"],
						["Doe, Jon", "Jon", "Doe", "student"]
						["B, Steven", "Steven", "B", "admin"],
						["Doe, Jon", "Jon", "Doe", "student"]
						["B, Steven", "Steven", "B", "admin"],
						["Doe, Jon", "Jon", "Doe", "student"]
					];
				case "evaluation":
				case "enrollments":
				default:
					return [
						["displayName", "type", "course"],
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"]
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"]
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"]
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"]
						["B, Steven", "decimal", "9"],
						["T, Est", "decimal", "6"]
					];
			}
		},
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));



