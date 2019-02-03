var fs = require('fs');
const taxi = require('./secureLogin');
const functionDb = require('../database/FunctionDB');
const LOCATIONS = taxi.LOCATIONS;
const Ride = taxi.Ride;
const Passenger = taxi.Passenger;

const STOP_TIME = 5; //how long does a taxi wait
const TRAVEL_DELAY = 1.5; //how mush longer is the actual travel time


var rawRides;
fs.readFile("./rides.json", 'utf8', function (err, data) {
	if (err) throw err;
	rawRides = JSON.parse(data);
});

var rawPassengers;
fs.readFile("./passengers.json", 'utf8', function (err, data) {
	if (err) throw err;
	rawPassengers = JSON.parse(data);
});

exports.getSchedule = function getSchedule(day) {
	const passengers = rawPassengers;
	const rides = rawRides[day].map(raw => {
		const ride = new Ride(raw.capacity);
		let time = moment().hours(raw.endHours).minutes(raw.endMinutes);
		for (let i = raw.stops.length - 1; i--; i >= 0) {
			ride.addStop(raw.stops[i], time);
			if (i > 0) {
				time.subtract(getDuration(raw.stops[i], raw.stops[i - 1]) * TRAVEL_DELAY, "minutes");
				time.subtract(STOP_TIME, "minutes");
			}
		}
	});
	matchRidesAndPassengers(passengers, rides);
	console.log(rides);
}



function matchRidesAndPassengers(passengers, rides) {
	passengers.forEach((passenger) => {
		rides.some(ride => {
			const stop1 = ride.stopsAt(passenger.from);
			const stop2 = ride.stopsAt(passenger.to);
			if (stop1 && stop2 && stop1.time.isBefore(stop2.time)) {
				const fits = ride.addPassengerIfPossible(passenger);
				if (fits) {
					return true;
				}
			}
		});
	});
}

console.log(rides[0]);





