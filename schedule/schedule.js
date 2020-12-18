$(() => {
	$.getJSON("https://api.q-highschool.nl/api/function/schedule/2020/48", (data) => {
		console.log(data)

		$("#monday").append(createLesson(data[0]))
	}).fail(() => {
		$("body").text("Er iets misgegaan bij het ophalen van de data.")
	})

	createLesson = (lesson) => {
		const {courseName, subjectName, teacherName, schoolLocation,
		 schoolAddress, classRoom, startTime, endTime} = lesson
		return $("<div>", { class: "lesson" }).append(
			$("<h2>").text(courseName),
			$("<h4>").text(subjectName),
			$("<hr/>"),
			$("<p>").text(teacherName),
			$("<hr/>"),
			$("<p>").text(schoolLocation),
			$("<p>").text(schoolAddress),
			$("<p>").text(classRoom),
			$("<hr/>"),
			$("<p>").text(startTime + " - " + endTime),
		)
	}
});