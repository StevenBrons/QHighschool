let curDate;

let getData = () => {
	let [year, week] = getWeekNumber(curDate)
	console.log(week, year)
	$.getJSON(`https://api.q-highschool.nl/api/function/schedule/${year}/${week}`, (data) => {
		renderData(data)
	}).fail(() => {
		$("body").text("Er iets misgegaan bij het ophalen van de data.")
	})
}

function translateWeekday(weekday) {
	switch (weekday) {
		case "maandag": return "monday";
		case "dinsdag": return "tuesday";
		case "woensdag": return "wednesday";
		case "donderdag": return "thursday";
		case "vrijdag": return "friday";
	}
	return weekday;
}

let renderData = (data) => {
	data = orderAndSort(data);
	$("#monday").empty();
	$("#tuesday").empty();
	$("#wednesday").empty();
	$("#thursday").empty();
	$("#friday").empty();

	$("#monday").append(data["monday"].map((lesson) => createLesson(lesson)))
	$("#monday .date").text(dateString(curDate))

	$("#tuesday").append(data["tuesday"].map((lesson) => createLesson(lesson)))
	let tempDate = new Date(curDate.getTime())
	tempDate.setDate(tempDate.getDate() + 1)
	$("#tuesday .date").text(dateString(tempDate))

	$("#wednesday").append(data["wednesday"].map((lesson) => createLesson(lesson)))
	tempDate.setDate(tempDate.getDate() + 1)
	$("#wednesday .date").text(dateString(tempDate))

	$("#thursday").append(data["thursday"].map((lesson) => createLesson(lesson)))
	tempDate.setDate(tempDate.getDate() + 1)
	$("#thursday .date").text(dateString(tempDate))

	$("#friday").append(data["friday"].map((lesson) => createLesson(lesson)))
	tempDate.setDate(tempDate.getDate() + 1)
	$("#friday .date").text(dateString(tempDate))

	$(".week-controls .date").text("Week " + getWeekNumber(curDate)[1] + " " + curDate.getFullYear())
}

// sort lessons into weekdays and sort lessons within weekday based on startTime
let orderAndSort = (data) => {
	data = data.reduce((week, lesson) => {
		week[translateWeekday(lesson.day)].push(lesson)
		return week
	}, { "monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [] })
	Object.keys(data).map((day) => {
		data[day].sort((a, b) => {
			let comp = compareTime(a.startTime, b.startTime)
			if (comp == 0)
				return compareTime(a.endTime, b.endTime)
			return comp
		})
	})
	return data
}

let compareTime = (timeA, timeB) => {
	// "7:00" -> "07:00"
	if (!timeA) return -1;
	if (timeA.length == 4)
		timeA = "0" + timeA
	if (timeB.length == 4)
		timeB = "0" + timeB

	return timeA > timeB ? 1 : (timeB > timeA ? -1 : 0)
}

let createLesson = (lesson) => {
	const { courseName, subjectName, teacherName, location, classRoom, startTime = "", endTime = "" } = lesson
	return $("<div>", { class: "lesson" }).append(
		$("<h3>", { class: "course" }).text(courseName ? courseName : ""),
		$("<h4>", { class: "subject" }).text(subjectName ? subjectName : ""),
		$("<hr/>"),
		$("<p>", { class: "teacher" }).text(teacherName ? teacherName : ""),
		$("<hr/>"),
		$("<p>", { class: "location" }).text(location ? location : ""),
		$("<p>", { class: "room" }).text(classRoom ? classRoom : ""),
		$("<hr/>"),
		$("<p>", { class: "time" }).text(startTime + " - " + endTime),
	)
}

const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
let dateString = (d) => {
	return d.getDate() + " " + MONTHS[d.getMonth()]
}

let getWeekNumber = (d) => {
	// Copy date so don't modify original
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	// Set to nearest Thursday: current date + 4 - current day number
	// Make Sunday's day number 7
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	// Get first day of year
	let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	// Calculate full weeks to nearest Thursday
	let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
	// Return array of year and week number
	return [d.getUTCFullYear(), weekNo];
}

let getCurDate = () => {
	// If today is a week day, set date to monday of that week. In weekend set to next monday
	let date = new Date()
	if (date.getDay() == 0)
		date.setDate(date.getDate() + 1)
	else if (date.getDay() == 6)
		date.setDate(date.getDate() + 2)
	else
		date.setDate(date.getDate() - date.getDay() + 1)
	return date
}

$(() => {
	curDate = getCurDate()
	getData()

	$(".week-button#next").click(() => {
		curDate.setDate(curDate.getDate() + 7)
		getData()
	})

	$(".week-button#previous").click(() => {
		curDate.setDate(curDate.getDate() - 7)
		getData()
	})
});