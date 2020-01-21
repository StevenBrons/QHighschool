import React, { Component } from 'react';
import Page from '../Page';
import { Typography, Divider } from '@material-ui/core/';
import EducationData from "./EducationData"
import PersonalData from "./PersonalData"

import { connect } from 'react-redux';
import LoginProvider from '../../lib/LoginProvider';
import "./Profile.css";

const sectorsVMBO = [
	"Bouwen, wonen en interieur",
	"Dienstverlening en producten",
	"Economie en ondernemen",
	"Groen",
	"Horeca, bakkerij en recreatie",
	"Maritiem en techniek",
	"Media, vormgeving en ICT",
	"Mobiliteit en transport",
	"Produceren, installeren en energie",
	"Zorg en welzijn",
];
const sectorsMAVO = [
	"Economie",
	"Landbouw (Groen)",
	"Techniek",
	"Zorg en welzijn",
];
const profiles = [
	"Cultuur en Maatschappij",
	"Economie en Maatschappij",
	"Natuur en Gezondheid",
	"Natuur en Techniek",
];
const schools = [
	"Beekdal Lyceum",
	"Candea College",
	"Centraal Bureau",
	"Lyceum Elst",
	"Liemers College",
	"Lorentz Lyceum",
	"Maarten van Rossem",
	"Montessori College Arnhem",
	"Olympus College",
	"Produs Praktijkonderwijs",
	"Stedelijk Gymnasium Arnhem",
	"Symbion",
	"Vmbo 't Venster",
	"Het Westeraam",
]

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


class Profile extends Component {

	constructor(props) {
		super(props);
	}

	onChange = (field, value) => {
		this.setState({
			user: {
				...this.state.user,
				[field]: value,
			}
		})
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			orgUser: nextProps.user,
			user: nextProps.user,
			...prevState,
		}
	}

	render() {
		const user = this.state.user;
		return (
			<LoginProvider>
				<Page className="Profile">
					<Typography variant="h4" color="primary">
						{user.displayName}
					</Typography>
					<Divider />
					<PersonalData {...user} onChange={this.onChange} />
					<EducationData  {...user} />
				</Page>
			</LoginProvider>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		user: state.users[state.userId],
	}
}

function mapDispatchToProps(dispatch) {
	return {
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);