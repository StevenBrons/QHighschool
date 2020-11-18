let possibleValues = {
	role: {
		"student": {
			level: ["Praktijkschool", "ISK", "n.v.t.", "Jan Ligthart", "OPUS", "MAVO", "VMBO", "HAVO", "VWO", "AGORA"],
		},
		"teacher": {
			level: ["-"],
			profile: ["n.v.t."],
			year: ["n.v.t."],
		},
		"admin": {
			level: ["-"],
			profile: ["n.v.t."],
			year: ["n.v.t."],
		},
		"grade_admin": {
			level: ["-"],
			profile: ["n.v.t."],
			year: ["n.v.t."],
		}
	},
	school: {
		"Beekdal Lyceum": {
			level: ["HAVO", "VWO", "-"],
			schoolLocation: ["Bernhardlaan 49, Arnhem"],
		},
		"Candea College": {
			level: ["VMBO", "MAVO", "HAVO", "VWO", "-"],
			schoolLocation: [
				"Eltensestraat 8, Duiven",
				"Saturnus 1, Duiven",
			],
		},
		"Centraal Bureau": {
			level: ["n.v.t.", "-"],
			schoolLocation: [
				"Saturnus 5, Duiven"
			],
			profile: ["n.v.t."],
			year: ["n.v.t."],
		},
		"Lyceum Elst": {
			level: ["MAVO", "HAVO", "VWO", "-"],
			schoolLocation: ["Auditorium 3, Elst"],
		},
		"Liemers College": {
			level: ["VMBO", "MAVO", "HAVO", "VWO", "-"],
			schoolLocation: [
				"Dijksestraat 12, Didam",
				"Stationspoort 36, Zevenaar",
				"Heerenmäten 6, Zevenaar",
				"Zonegge (AGORA) 07-09, Zevenaar",
				"Zonegge 07-09, Zevenaar",
			],
		},
		"Lorentz Lyceum": {
			level: ["HAVO", "VWO", "OPUS", "n.v.t.", "-"],
			schoolLocation: ["Metamorfosenallee 100, Arnhem"]
		},
		"Maarten van Rossem": {
			level: ["VMBO", "-"],
			schoolLocation: ["Groningensingel 1235, Arnhem"],
		},
		"Montessori College Arnhem": {
			level: ["MAVO", "HAVO", "VWO", "-"],
			schoolLocation: ["Utrechtseweg 174, Arnhem"]
		},
		"Olympus College": {
			level: ["Jan Ligthart", "MAVO", "HAVO", "VWO", "-"],
			schoolLocation: ["Olympus 11, Arnhem"],
		},
		"Produs Praktijkonderwijs": {
			level: ["Praktijkschool", "-"],
			schoolLocation: ["Leidenweg 60, Arnhem"],
		},
		"Stedelijk Gymnasium Arnhem": {
			level: ["VWO", "-"],
			schoolLocation: ["Thorbeckestraat 17, Arnhem"],
		},
		"Symbion": {
			level: ["Praktijkschool", "-"],
			schoolLocation: ["Hoge Witteveld 2, Didam"],
		},
		"Vmbo 't Venster": {
			level: ["ISK", "VMBO", "MAVO", "-"],
			schoolLocation: ["Thomas a Kempislaan 82, Arnhem"],
		},
		"Het Westeraam": {
			level: ["VMBO", "-"],
			schoolLocation: ["Auditorium 6, Elst"],
		},
	},
	level: {
		"-": {},// Teacher/GradeAdmin/Admin
		"Praktijkschool": {
			year: ["1", "2", "3", "4", "5", "6"],
			profile: ["n.v.t."],
		},
		"ISK": {
			year: ["n.v.t."],
			profile: ["n.v.t."],
		},
		"VMBO": {
			year: ["1", "2", "3", "4"],
			profile: [
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
				"n.v.t.",
			],
		},
		"MAVO": {
			year: ["1", "2", "3", "4"],
			profile: [
				"Economie",
				"Landbouw (Groen)",
				"Techniek",
				"Zorg en welzijn",
				"n.v.t.",
			],
		},
		"HAVO": {
			year: ["1", "2", "3", "4", "5"],
			profile: [
				"Cultuur en Maatschappij",
				"Economie en Maatschappij",
				"Natuur en Gezondheid",
				"Natuur en Techniek",
				"Natuur en Techniek & Natuur en Gezondheid",
				"Cultuur en Maatschappij & Economie en Maatschappij",
				"n.v.t.",
			]
		},
		"VWO": {
			year: ["1", "2", "3", "4", "5", "6"],
			profile: [
				"Cultuur en Maatschappij",
				"Economie en Maatschappij",
				"Natuur en Gezondheid",
				"Natuur en Techniek",
				"Natuur en Techniek & Natuur en Gezondheid",
				"Cultuur en Maatschappij & Economie en Maatschappij",
				"n.v.t.",
			],
		},
		"Jan Ligthart": {
			year: ["1"],
			profile: ["n.v.t."]
		},
		"AGORA": {
		},
		"OPUS": {
			year: ["1", "2", "3", "4", "5", "6"],
			profile: [
				"Cultuur en Maatschappij",
				"Economie en Maatschappij",
				"Natuur en Gezondheid",
				"Natuur en Techniek",
				"Natuur en Techniek & Natuur en Gezondheid",
				"Cultuur en Maatschappij & Economie en Maatschappij",
				"n.v.t."
			],
		},
		"n.v.t.": {
			year: ["n.v.t."],
			profile: ["n.v.t."],
		},
	},
	profile: {
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
		// "Zorg en welzijn": {}, IS A PROFILE OF VMBO AS WELL AS MAVO!
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
		"Natuur en Techniek & Natuur en Gezondheid": {
			year: ["4", "5", "6"],
		},
		"Cultuur en Maatschappij & Economie en Maatschappij": {
			year: ["4", "5", "6"],
		},
		"n.v.t.": {},
	},
	schoolLocation: {
		"Leidenweg 60, Arnhem": {},
		"Hoge Witteveld 2, Didam": {},
		"Thomas a Kempislaan 82, Arnhem": {},
		"Groningensingel 1235, Arnhem": {},
		"Auditorium 6, Elst": {},
		"Dijksestraat 12, Didam": {},
		"Stationspoort 36, Zevenaar": {},
		"Heerenmäten 6, Zevenaar": {},
		"Zonegge (AGORA) 07-09, Zevenaar": {},
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
		"Metamorfosenallee 100, Arnhem": {},
		"Bernhardlaan 49, Arnhem": {},
		"Saturnus 5, Duiven": {},
	},
	year: {
		"n.v.t.": {},
		"1": {
			profile: ["n.v.t."],
		},
		"2": {
			profile: ["n.v.t."],
		},
		"3": {},
		"4": {},
		"5": {},
		"6": {},
	}
}

// Turn an array of form [a,b,...n] to an object of form {"a": {}, "b": {}, ... "n": {}}
function arrToObj(arr) {
	return arr.reduce((acc, cur) => {
		return {
			...acc,
			[cur]: {},
		}
	}, {});
}

// transform arrays to objects
for (let field in possibleValues) {
	for (let value in possibleValues[field]) {
		for (let constraint in possibleValues[field][value]) {
			possibleValues[field][value][constraint] = arrToObj(possibleValues[field][value][constraint]);
		}
	}
}

// Turn an object of form {"a": {"c":x},...} into {"a": {"c": {}}}
function oneDeep(obj) {
	let y = {};
	for (let x in obj) {
		y[x] = arrToObj(Object.keys(obj[x]));
	}
	return y;
}

let oneDeepPossibleValues = oneDeep(possibleValues)

// fill missing values
for (let field in possibleValues) {
	for (let value in possibleValues[field]) {
		possibleValues[field][value] = {
			...oneDeepPossibleValues,
			...possibleValues[field][value]
		}
	}
}


export { arrToObj };
export default possibleValues;