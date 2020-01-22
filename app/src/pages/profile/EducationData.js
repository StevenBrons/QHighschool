import React, { Component } from 'react';
import { Typography, Divider } from '@material-ui/core/';
import Field from '../../components/Field';
import filter from "lodash/filter";

const possibleValues = {
	school: {
		"Beekdal Lyceum": {
			level: ["HAVO", "VWO"],
			schoolLocation: ["Bernhardlaan 49, Arnhem"],
		},
		"Candea College": {
			level: ["VMBO", "MAVO", "HAVO", "VWO"],
			schoolLocation: [
				"Eltensestraat 8, Duiven",
				"Saturnus 1, Duiven",
			],
		},
		"Centraal Bureau": {
			level: ["n.v.t."],
			schoolLocation: [
				"Saturnus 5, Duiven"
			]
		},
		"Lyceum Elst": {
			level: ["MAVO", "HAVO", "VWO"],
			schoolLocation: ["Auditorium 3, Elst"],
		},
		"Liemers College": {
			level: ["VMBO", "MAVO", "HAVO", "VWO"],
			schoolLocation: [
				"Dijksestraat 12, Didam",
				"Stationspoort 3, Zevenaar",
				"Heerenmäten 6, Zevenaar",
				"Zonegge 07-09, Zevenaar",
			],
		},
		"Lorentz Lyceum": {
			level: ["HAVO", "VWO"],
			schoolLocation: ["Parnassusstraat 20, Arnhem", "Groningensingel 1245, Arnhem"]
		},
		"Maarten van Rossem": {
			level: ["VMBO"],
			schoolLocation: ["Groningensingel 1235, Arnhem"],
		},
		"Montessori College Arnhem": {
			level: ["MAVO", "HAVO", "VWO"],
			schoolLocation: ["Utrechtseweg 174, Arnhem"]
		},
		"Olympus College": {
			level: ["ISK", "Jan Ligthart", "MAVO", "HAVO", "VWO"],
		},
		"Produs Praktijkonderwijs": {
			level: ["Praktijkschool"],
			schoolLocation: ["Leidenweg 60, Arnhem"],
		},
		"Stedelijk Gymnasium Arnhem": {
			level: ["VWO"],
			schoolLocation: ["Thorbeckestraat 17, Arnhem"],
		},
		"Symbion": {
			level: ["Praktijkschool"],
			schoolLocation: ["Hoge Witteveld 2, Didam"],
		},
		"Vmbo 't Venster": {
			level: ["ISK", "VMBO"],
			schoolLocation: ["Thomas a Kempislaan 82, Arnhem"],
		},
		"Het Westeraam": {
			level: ["VMBO"],
			schoolLocation: ["Auditorium 6, Elst"],
		},
	},
	level: {
		"Praktijkschool": {
			year: ["1", "2,", "3", "4", "5", "6"],
			profileOrSector: ["n.v.t."],
		},
		"ISK": {
			year: ["n.v.t."],
			profileOrSector: ["n.v.t."],
		},
		"VMBO": {
			year: ["1", "2", "3", "4"],
			profileOrSector: [
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
			],
		},
		"MAVO": {
			year: ["1", "2", "3", "4"],
			profileOrSector: [
				"Economie",
				"Landbouw (Groen)",
				"Techniek",
				"Zorg en welzijn",
			],
		},
		"HAVO": {
			year: ["1", "2", "3", "4", "5"],
			profileOrSector: [
				"Cultuur en Maatschappij",
				"Economie en Maatschappij",
				"Natuur en Gezondheid",
				"Natuur en Techniek",
			]
		},
		"VWO": {
			year: ["1", "2,", "3", "4", "5", "6"],
			profileOrSector: [
				"Cultuur en Maatschappij",
				"Economie en Maatschappij",
				"Natuur en Gezondheid",
				"Natuur en Techniek",
			],
		},
		"Jan Ligthart": {
			year: ["1"],
			profileOrSector: ["n.v.t."]
		},
		"OPUS": {
			year: ["1", "2,", "3", "4", "5", "6"],
			profileOrSector: [
				"Cultuur en Maatschappij",
				"Economie en Maatschappij",
				"Natuur en Gezondheid",
				"Natuur en Techniek",
				"n.v.t."
			],
		},
		"n.v.t.": {
			year: ["n.v.t."],
			profileOrSector: ["n.v.t."],
		},
	},
	profileOrSector: {
		// VMBO
		"Bouwen, wonen en interieur": {},
		"Dienstverlening en producten": {},
		"Economie en ondernemen": {},
		"Groen": {},
		"Horeca, bakkerij en recreatie": {},
		"Maritiem en techniek": {},
		"Media, vormgeving en ICT": {},
		"Mobiliteit en transport": {},
		"Produceren, installeren en energie": {},
		"Zorg en welzijn": {},
		// MAVO
		"Economie": {},
		"Landbouw (Groen)": {},
		"Techniek": {},
		"Zorg en welzijn": {
		},
		// HAVO/VWO
		"Cultuur en Maatschappij": {
			year: ["4", "5", "6"],
		},
		"Economie en Maatschappij": {
			year: ["4", "5", "6"],
		},
		"Natuur en Gezondheid": {
			year: ["4", "5", "6"],
		},
		"Natuur en Techniek": {
			year: ["4", "5", "6"],
		},
		"n.v.t.": {},
	},
	schoolLocation: {
		"Parnassusstraat 20, Arnhem": {},
		"Leidenweg 60, Arnhem": {},
		"Hoge Witteveld 2, Didam": {},
		"Thomas a Kempislaan 82, Arnhem": {},
		"Groningensingel 1235, Arnhem": {},
		"Auditorium 6, Elst": {},
		"Dijksestraat 12, Didam": {},
		"Stationspoort 3, Zevenaar": {},
		"Heerenmäten 6, Zevenaar": {},
		"Zonegge 07-09, Zevenaar": {},
		"Eltensestraat 8, Duiven": {
			level: ["VMBO", "MAVO"],
		},
		"Saturnus 1, Duiven": {
			level: ["HAVO", "VWO"],
		},
		"Thorbeckestraat 17, Arnhem": {},
		"Auditorium 3, Elst": {},
		"Utrechtseweg 174, Arnhem": {},
		"Olympus 11, Arnhem": {},
		"Groningensingel 1245, Arnhem": {},
		"Bernhardlaan 49, Arnhem": {},
		"Saturnus 5, Duiven": {},
	},
	year: {
		"n.v.t.": {},
		"1": {
			profileOrSector: ["n.v.t."],
		},
		"2": {
			profileOrSector: ["n.v.t."],
		},
		"3": {},
		"4": {},
		"5": {},
		"6": {},
	}
}

class EducationData extends Component {

	constructor(props) {
		super(props);
	}

	reduceChoices = (field) => {
		let pv = { ...possibleValues };
		for (let i = 0; i < 1; i++) {
			for (let field in pv) {
				const userValue = this.props[field];
				let constraints = pv[field][userValue];
				for (let constraint in constraints) {
					const C = constraints[constraint].reduce((acc, cur) => {
						return {
							...acc,
							[cur]: {},
						}
					}, {});
					console.log(pv[constraint]);
					console.log(C);
					pv[constraint] = this.intersection(pv[constraint], C);
					console.log(pv[constraint]);
				}
			}
		}
		return Object.keys(pv[field]);
	}


	intersection = (o1, o2) => {
		return Object.keys(o1).concat(Object.keys(o2)).sort().reduce(function (r, a, i, aa) {
			if (i && aa[i - 1] === a) {
				return {
					...r,
					[a]: o1[a]
				}
			}
			return r;
		}, {});
	}

	sectorOrProfileLabel = () => {
		switch (this.props.sectorOrProfile) {
			case "MAVO":
			case "VMBO":
				return "sector";
			case "VWO":
			case "HAVO":
			case "OPUS":
			default:
				return "profile"
		}
	}

	normalizeRole = (role) => {
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


	render() {
		const p = this.props;
		return (
			<div>
				<Typography variant="h6" color="secondary">
					School gegevens
				</Typography>
				<table>
					<tbody>
						<tr>
							<Field
								value="School"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.school}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
								editable
								options={this.reduceChoices("school")}
								onChange={(value) => p.onChange(value, "school")}
							/>
						</tr>
						<tr>
							<Field
								value="Hoofdrol"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={this.normalizeRole(p.role)}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
							/>
						</tr>
						<tr>
							<Field
								value="School email"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.email}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
							/>
						</tr>
					</tbody>
				</table>
				<Divider />
				<table>
					<tbody>
						<tr>
							<Field
								value="Opleidingsniveau"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.level}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
								validate={{ notEmpty: true }}
								options={this.reduceChoices("level")}
								editable
							/>
						</tr>
						<tr>
							<Field
								value="School locatie"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.schoolLocation}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
								validate={{ notEmpty: true }}
								options={this.reduceChoices("schoolLocation")}
								onChange={(value) => p.onChange(value, "schoolLocation")}
								editable
							/>
						</tr>
						<tr>
							<Field
								value="Leerjaar"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.year}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
								validate={{ notEmpty: true }}
								options={this.reduceChoices("year")}
								onChange={(value) => p.onChange(value, "year")}
								editable
							/>
						</tr>
						<tr>
							<Field
								value={this.sectorOrProfileLabel()}
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.profileOrSector}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
								validate={{ notEmpty: true }}
								options={this.reduceChoices("profileOrSector")}
								onChange={(value) => p.onChange(value, "profileOrSector")}
								editable
							/>
						</tr>
						<tr>
							<Field
								value="School locatie"
								layout={{ td: true }}
								style={{ margin: "none" }}
							/>
							<Field
								value={p.schoolLocation}
								style={{ margin: "none" }}
								layout={{ td: true, area: true }}
								validate={{ notEmpty: true }}
								options={this.reduceChoices("schoolLocation")}
								onChange={(value) => p.onChange(value, "schoolLocation")}
								editable
							/>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default EducationData;