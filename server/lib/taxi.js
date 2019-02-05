const moment = require('moment');
moment.locale('nl');

var durations;
fs.readFile("./durations.json", 'utf8', function (err, data) {
	if (err) throw err;
	const durations = JSON.parse(data);
});

exports.LOCATIONS = [
	"Beekdal",
	"Candea College",
	"Lyceum Elst",
	"Liemers College",
	"Lorentz Lyceum",
	"Maarten van Rossem",
	"Montessori College",
	"Olympus College",
	"Produs",
	"Stedelijk Gymnasium Arnhem",
	"Symbion",
	"'t Venster",
	"Het Westeraam"
];

function checkValidLocation(...locations) {
	locations.forEach(location => {
		if (LOCATIONS.indexOf(location) == -1) {
			throw new Error("Location " + location + " is invalid");
		}
	});
}

exports.getAddress = function (location) {
	checkValidLocation(location);
	switch (location) {
		case "Beekdal":
			return "";
		case "Candea College":
			return "Saturnus 1 te Duiven";
		case "Liemers College":
			return "Heerenmäten 6, Zevenaar";
		case "Montessori College":
			return "";
		case "Olympus College":
			return "";
		case "Produs":
			return "";
		case "Stedelijk Gymnasium Arnhem":
			return "Thorbeckestraat 17, Arnhem";
		case "Symbion":
			return "";
		case "'t Venster":
			return "";
		case "Lyceum Elst":
		case "Het Westeraam":
		case "Lyceum Elst||Het Westeraam":
			return "";
		case "Lorentz Lyceum":
		case "Maarten van Rossem":
		case "Maarten van Rossem||Lorentz Lyceum":
	}
}

exports.getMeetingPoint = function (location) {
	checkValidLocation(location);
	switch (location) {
		case "Beekdal":
			return "De conciërgeloge, direct na de hoofdingang";
		case "Candea College":
			return "De concièrgeloge bij de leerlingeningang";
		case "Liemers College":
			return "Receptie van het Liemers College, bij de hoofdingang op de parkeerplaats";
		case "Montessori College":
			return "";
		case "Olympus College":
			return "";
		case "Produs":
			return "";
		case "Stedelijk Gymnasium Arnhem":
			return "Receptie van SGA, direct na de hoofdingang";
		case "Symbion":
			return "";
		case "'t Venster":
			return "";
		case "Lyceum Elst":
		case "Het Westeraam":
		case "Lyceum Elst||Het Westeraam":
			return "";
		case "Lorentz Lyceum":
		case "Maarten van Rossem":
		case "Maarten van Rossem||Lorentz Lyceum":
	}
}

exports.getDuration = function getDuration(loc1, loc2) {
	if (loc1 === "Maarten van Rossem" || loc1 === "Lorentz Lyceum") {
		loc1 = "Maarten van Rossem||Lorentz Lyceum";
	}
	if (loc1 === "Lyceum Elst" || loc1 === "Het Westeraam") {
		loc1 = "Lyceum Elst||Het Westeraam";
	}
	if (loc1 === loc2) {
		return 0;
	}
	if (durations[loc1][loc2] != null) {
		return durations[loc1][loc2];
	} else {
		return durations[loc2][loc1];
	}
}

exports.Ride = class Ride {
	constructor(capacity) {
		this.stops = [];
		this.passengers = [];
		this.capacity = capacity;
	}

	addStop(location, time) {
		checkValidLocation(location);
		this.stops.push({
			location: location,
			time: time,
		});
		this.stops.sort((l1, l2) => {
			return l1.time.isBefore(moment(l2.time));
		});
	}

	stopsAt(location) {
		return this.stops.find(stop => stop.location === location);
	}

	addPassengerIfPossible(passenger) {
		checkValidLocation(passenger.from, passenger.to);
		this.passengers.push(passenger);
		let fits = this.checkCapacityLimit();
		if (!fits) {
			this.passengers.splice(this.passengers.indexOf(passenger), 1);
		}
		return fits;
	}

	checkCapacityLimit() {
		let curPassengers = [];
		this.stops.forEach(stop => {
			this.passengers.forEach(passenger => {
				if (stop.location === passenger.to && stop.time.hours() === passenger.endTime.hours() &&
					stop.time.minutes() === passenger.endTime.minutes()) {
					curPassengers.push(passenger);
				}
			});
			curPassengers.forEach((passenger, i) => {
				if (stop.location === passenger.from) {
					curPassengers.splice(i, 1);
				}
			});
			if (curPassengers.length > this.capacity) {
				return false;
			}
		});
		return true;
	}

}

exports.Passenger = class Passenger {
	constructor(id, from, to, endTime) {
		this.id = id;
		this.from = from;
		this.to = to;
		this.endTime = endTime;
	}
}

