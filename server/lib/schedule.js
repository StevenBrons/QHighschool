var moment = require('moment');
moment.locale('nl');

exports.getLessonDate = function (period, numberInBlock, day) {
	const week = exports.schedule.filter((week) => {
		return ((week.period + "") === (period + "") && (week.numberInBlock + "") === (numberInBlock + ""));
	})[0];

	if (week == null) {
		throw new Error("Schedule is wrong!");
	}
	if (week.year !== moment().year()) {
		return moment().year(week.year).week(week.weekNumber - 1).day(day).toDate();
	} else {
		return moment().year(week.year).week(week.weekNumber).day(day).toDate();
	}
}

exports.getCurrentSchoolYear = () => {
	const currentYear = moment().year();
	if (moment().week() <= 32) {
		return (currentYear - 1) + "/" + currentYear;
	} else {
		return currentYear + "/" + (currentYear + 1);
	}
}

exports.getCurrentPeriod = () => {
	const currentWeek = moment().week();
	const obj = exports.schedule.find((obj) => {
		return obj.weekNumber === currentWeek;
	});
	if (obj) {
		return obj.period;
	}
	return -1;
}

exports.getCurrentWeekInBlock = () => {
	const currentWeek = moment().week();
	const obj = exports.schedule.find((obj) => {
		return obj.weekNumber === currentWeek;
	});
	if (obj) {
		return obj.numberInBlock;
	}
	return -1;
}

exports.shouldBeSynced = (group) => {
	return exports.getCurrentPeriod() <= group.period &&
		group.schoolYear === exports.getCurrentSchoolYear();
}

exports.getEnrollmentPeriod = () => {
	let currentWeek = exports.getCurrentWeekInBlock();
	let currentPeriod = exports.getCurrentPeriod();
	if (currentWeek >= 6 && currentPeriod != 4) {
		return currentPeriod + 1;
	} else {
		return currentPeriod;
	}
}

exports.schedule = [
	//block 1
	{ weekNumber: 35, period: 1, numberInBlock: 1, year: 2018, },
	{ weekNumber: 36, period: 1, numberInBlock: 2, year: 2018, },
	{ weekNumber: 37, period: 1, numberInBlock: 3, year: 2018, },
	{ weekNumber: 38, period: 1, numberInBlock: 4, year: 2018, },
	{ weekNumber: 39, period: 1, numberInBlock: 5, year: 2018, },
	{ weekNumber: 40, period: 1, numberInBlock: 6, year: 2018, },
	{ weekNumber: 41, period: 1, numberInBlock: 7, year: 2018, },
	{ weekNumber: 43, period: 1, numberInBlock: 8, year: 2018, },
	{ weekNumber: 44, period: 1, numberInBlock: 9, year: 2018, },
	//block 2
	{ weekNumber: 45, period: 2, numberInBlock: 1, year: 2018, },
	{ weekNumber: 46, period: 2, numberInBlock: 2, year: 2018, },
	{ weekNumber: 47, period: 2, numberInBlock: 3, year: 2018, },
	{ weekNumber: 48, period: 2, numberInBlock: 4, year: 2018, },
	{ weekNumber: 49, period: 2, numberInBlock: 5, year: 2018, },
	{ weekNumber: 50, period: 2, numberInBlock: 6, year: 2018, },
	{ weekNumber: 51, period: 2, numberInBlock: 7, year: 2018, },
	{ weekNumber: 2, period: 2, numberInBlock: 8, year: 2019, },
	{ weekNumber: 3, period: 2, numberInBlock: 9, year: 2019, },
	//block 3
	{ weekNumber: 4, period: 3, numberInBlock: 1, year: 2019, },
	{ weekNumber: 5, period: 3, numberInBlock: 2, year: 2019, },
	{ weekNumber: 6, period: 3, numberInBlock: 3, year: 2019, },
	{ weekNumber: 7, period: 3, numberInBlock: 4, year: 2019, },
	{ weekNumber: 8, period: 3, numberInBlock: 5, year: 2019, },
	{ weekNumber: 9, period: 3, numberInBlock: 6, year: 2019, },
	{ weekNumber: 11, period: 3, numberInBlock: 7, year: 2019, },
	{ weekNumber: 12, period: 3, numberInBlock: 8, year: 2019, },
	{ weekNumber: 13, period: 3, numberInBlock: 9, year: 2019, },
	//block 4
	{ weekNumber: 14, period: 4, numberInBlock: 1, year: 2019, },
	{ weekNumber: 15, period: 4, numberInBlock: 2, year: 2019, },
	{ weekNumber: 16, period: 4, numberInBlock: 3, year: 2019, },
	{ weekNumber: 19, period: 4, numberInBlock: 4, year: 2019, },
	{ weekNumber: 20, period: 4, numberInBlock: 5, year: 2019, },
	{ weekNumber: 21, period: 4, numberInBlock: 6, year: 2019, },
	{ weekNumber: 22, period: 4, numberInBlock: 7, year: 2019, },
	{ weekNumber: 23, period: 4, numberInBlock: 8, year: 2019, },
	{ weekNumber: 24, period: 4, numberInBlock: 9, year: 2019, },
];