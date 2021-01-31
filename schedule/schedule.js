// let testData = [{ "day": "friday", "startTime": "12:00", "endTime": "14:00", "courseName": "Lineaire Algebra B", "schoolLocation": "Praedinius Gymnasium", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "J. de Boer", "subjectName": "Wiskunde" }, { "day": "monday", "startTime": "12:00", "endTime": "14:00", "courseName": "CourseName komt hiero.", "schoolLocation": "Liemers College", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "Naam van de Docent", "subjectName": "vaknaam komt hiero" }, { "day": "monday", "startTime": "11:30", "endTime": "14:00", "courseName": "CourseName ", "schoolLocation": "Liemers College", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "Naam van de Docent", "subjectName": "vaknaam komt hiero" }, { "day": "monday", "startTime": "16:00", "endTime": "18:00", "courseName": "CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.", "schoolLocation": "Liemers College", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "Naam van de Docent", "subjectName": "vaknaam komt hiero" }, { "day": "tuesday", "startTime": "9:00", "endTime": "18:00", "courseName": "CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.", "schoolLocation": "Liemers College", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "Naam van de Docent", "subjectName": "vaknaam komt hiero" }, { "day": "wednesday", "startTime": "16:00", "endTime": "18:00", "courseName": "CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.", "schoolLocation": "Liemers College", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "Naam van de Docent", "subjectName": "wiskunde" }, { "day": "tuesday", "startTime": "16:00", "endTime": "18:00", "courseName": "CourseName komt hiero.", "schoolLocation": "Liemers College", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "Naam van de Docent", "subjectName": "biologie" }, { "day": "wednesday", "startTime": "16:00", "endTime": "17:00", "courseName": "CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.", "schoolLocation": "Liemers College", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "Naam van de Docent", "subjectName": "biologie" }, { "day": "wednesday", "startTime": "16:00", "endTime": "19:00", "courseName": "CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.", "schoolLocation": "Liemers College", "schoolAddress": "Straatnaam 123", "classRoom": "1.2c", "teacherName": "Naam van de Docent", "subjectName": "biologie" }]

const COLORS = [
  "purple",
  "pink",
  "blue",
  "orange",
  "red",
  "green",
  "yellow"
];

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

let renderData = (data) => {
	subjectColors = getColors(data)
	data = orderAndSort(data)
	$("#monday").children().slice(2).remove()
	$("#monday").append(data["monday"].map((lesson) => createLesson(lesson, subjectColors[lesson.subjectName])))
	$("#monday .date").text(dateString(curDate))

	$("#tuesday").children().slice(2).remove()
	$("#tuesday").append(data["tuesday"].map((lesson) => createLesson(lesson, subjectColors[lesson.subjectName])))
	let tempDate = new Date(curDate.getTime())
	tempDate.setDate(tempDate.getDate() + 1)
	$("#tuesday .date").text(dateString(tempDate))

	$("#wednesday").children().slice(2).remove()
	$("#wednesday").append(data["wednesday"].map((lesson) => createLesson(lesson, subjectColors[lesson.subjectName])))
	tempDate.setDate(tempDate.getDate() + 1)
	$("#wednesday .date").text(dateString(tempDate))

	$("#thursday").children().slice(2).remove()
	$("#thursday").append(data["thursday"].map((lesson) => createLesson(lesson, subjectColors[lesson.subjectName])))
	tempDate.setDate(tempDate.getDate() + 1)
	$("#thursday .date").text(dateString(tempDate))

	$("#friday").children().slice(2).remove()
	$("#friday").append(data["friday"].map((lesson) => createLesson(lesson, subjectColors[lesson.subjectName])))
	tempDate.setDate(tempDate.getDate() + 1)
	$("#friday .date").text(dateString(tempDate))

	$(".week-controls .date").text("Week " + getWeekNumber(curDate)[1] + " " + curDate.getFullYear())
}

// sort lessons into weekdays and sort lessons within weekday based on startTime
let orderAndSort = (data) => {
	data = data.reduce((week, lesson) => {
		week[lesson.day].push(lesson)
		return week
	}, { "monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [] })
	Object.keys(data).map((day) => {
		data[day].sort((a, b) => {
			let comp = compareTime(a.startTime, b.startTime)
			if (comp == 0)
				return a.subjectName > b.subjectName ? 1 : (b.subjectName > a.subjectName? -1 : 0)
			return comp
		})
	})
	return data
}

let getColors = (data) => {
	let subjects = data.reduce((subjects, lesson) => {
		if (!subjects.includes(lesson.subjectName)) {
			subjects.push(lesson.subjectName)
		}
		return subjects
	}, [])
	
	let colors = {}
	for (i = 0; i < subjects.length; i++) {
		colors[subjects[i]] = COLORS[i % subjects.length]
	}
	return colors
}

let compareTime = (timeA, timeB) => {
	// "7:00" -> "07:00"
	if (timeA.length == 4)
		timeA = "0" + timeA
	if (timeB.length == 4)
		timeB = "0" + timeB

	return timeA > timeB ? 1 : (timeB > timeA ? -1 : 0)
}

let createLesson = (lesson, color) => {
	const { courseName, subjectName, teacherName, schoolLocation,
		schoolAddress, classRoom, startTime, endTime } = lesson
	return $("<div>", { class: "lesson " + color }).append(
		$("<h3>", { class: "course" }).text(courseName),
		$("<h4>", { class: "subject" }).text(subjectName),
		$("<hr/>"),
		$("<p>", { class: "teacher" }).text(teacherName),
		$("<hr/>"),
		$("<p>", { class: "location" }).text(schoolLocation),
		$("<p>", { class: "address" }).text(schoolAddress),
		$("<p>", { class: "room" }).text(classRoom),
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