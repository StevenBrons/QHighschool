import React, { Component } from 'react';
import { Typography, Divider } from '@material-ui/core/';

function normalizeRole(role) {
	switch (role) {
		case "student":
			return "leerling";
		case "teacher":
			return "expert";
		case "grade_admin":
			return "contactpersoon";
		case "admin":
			return "administrator";
	}
}


class PersonalData extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Typography variant="h6" color="primary">
					Persoonlijke gegevens
				</Typography>
				<Divider/>
			</div>
		);
	}
}


export default PersonalData;