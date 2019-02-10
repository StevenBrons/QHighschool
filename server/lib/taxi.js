const moment = require('moment');
moment.locale('nl');

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

