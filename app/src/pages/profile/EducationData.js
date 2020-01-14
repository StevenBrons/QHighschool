import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography, Divider } from '@material-ui/core/';

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


class EducationData extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Typography variant="h6" color="primary">
					School gegevens
				</Typography>
				<Divider/>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {

	}
}

function mapDispatchToProps(dispatch) {
	return {
	};
}


export default EducationData;