const ejs = require('ejs');
const fs = require('fs');

const User = require('../dec/UserDec');
const CourseGroup = require('../dec/CourseGroupDec');
const Participant = require('../dec/ParticipantDec');
const Lesson = require('../dec/LessonDec');
const Presence = require('../dec/PresenceDec');
const RIDES = require('./rides.json');
const SCHEDULE_EJS = fs.readFileSync("./views/taxiSchedule.ejs", 'utf8');

const PERIOD = 3;

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
		if (exports.LOCATIONS.indexOf(location) == -1) {
			throw new Error("Location " + location + " is invalid");
		}
	});
}

function getAddress(location) {
	checkValidLocation(location);
	switch (location) {
		case "Beekdal":
			return "Bernardlaan 49 in Arnhem";
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
			return "Auditorium 3 in Elst";
		case "Lorentz Lyceum":
		case "Maarten van Rossem":
		case "Maarten van Rossem||Lorentz Lyceum":
			return "Groningensingel 1245 in Arnhem";
	}
}

function getMeetingPoint(location) {
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
			return "bij de hoofdingang binnen";
		case "Lorentz Lyceum":
		case "Maarten van Rossem":
		case "Maarten van Rossem||Lorentz Lyceum":
			return "de leerlingenbalie, ingang links op het plein";
	}
}

function getDuration(loc1, loc2) {
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


async function mapPassengers(id, day, week) {
	const user = await User.findOne({ attributes: ["id", "displayName"], where: { id } });
	if (user == null) {
		return {
			displayName: "onbekend",
			userStatus: "onbekend",
		}
	}
	const courseGroup = await CourseGroup.findOne({
		attributes: ["id"],
		where: { day: day, },
		include: {
			model: Participant,
			where: { userId: user.id, }
		}
	});
	if (user == null) {
		return {
			displayName: user.dataValues.displayName,
			userStatus: "onbekend",
		}
	}
	let lesson;
	if (courseGroup != null) {
		lesson = await Lesson.findOne({
			attributes: ["id", "presence"],
			where: {
				courseGroupId: courseGroup.id,
				numberInBlock: week,
			}
		});
	}
	let willBePresent = true;
	if (lesson != null) {
		const presence = await Presence.findOne({
			attributes: ["userStatus"],
			where: {
				userId: user.id,
				lessonId: lesson.id
			}
		});
		if (lesson && lesson.presence === "unrequired") {
			willBePresent = false;
		}
		if (presence && presence.userStatus === "absent") {
			willBePresent = false;
		}
	}
	return {
		displayName: user.dataValues.displayName,
		userStatus: willBePresent ? "aanwezig" : "niet aanwezig",
	}
}

function getRides(userId) {
	const allRides = [];
	for (day in RIDES) {
		for (ride in RIDES[day]) {
			allRides.push(RIDES[day][ride]);
		}
	}
	if (userId == -1) {
		return allRides;
	} else {
		return allRides.filter(ride => {
			const s = ride.stops.find(stop => {
				return stop.in.indexOf(userId) !== -1;
			});
			return s != null;
		});
	}
}

exports.getSchedule = async function getSchedule(userId, week) {
	let schedules = [];
	const rides = getRides(userId);
	for (let r = 0; r < rides.length; r++) {
		for (let i = 0; i < rides[r].stops.length; i++) {
			rides[r].stops[i].meetingPoint = getMeetingPoint(rides[r].stops[i].location);
			rides[r].stops[i].address = getAddress(rides[r].stops[i].location);
			rides[r].stops[i].in = await Promise.all(rides[r].stops[i].in.map((p) => mapPassengers(p, day, week)));
			rides[r].stops[i].out = await Promise.all(rides[r].stops[i].out.map((p) => mapPassengers(p, day, week)));
		}
		schedules.push(ejs.render(SCHEDULE_EJS, rides[r], {}));
	}
	return schedules;
}




