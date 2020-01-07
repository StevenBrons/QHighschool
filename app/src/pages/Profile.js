import React, { Component } from 'react';
import Page from './Page';

import { connect } from 'react-redux';

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
	
]


class Profile extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page>
			</Page>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);