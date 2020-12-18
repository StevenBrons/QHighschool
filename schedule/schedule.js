let testData = [{"day":"monday", "startTime":"12:00","endTime":"14:00","courseName":"CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.","schoolLocation":"Liemers College","schoolAddress":"Straatnaam 123","classRoom":"1.2c","teacherName":"Naam van de Docent","subjectName":"vaknaam komt hiero"},{"day":"monday","startTime":"11:30","endTime":"14:00","courseName":"CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.","schoolLocation":"Liemers College","schoolAddress":"Straatnaam 123","classRoom":"1.2c","teacherName":"Naam van de Docent","subjectName":"vaknaam komt hiero"},{"day":"monday","startTime":"16:00","endTime":"18:00","courseName":"CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.","schoolLocation":"Liemers College","schoolAddress":"Straatnaam 123","classRoom":"1.2c","teacherName":"Naam van de Docent","subjectName":"vaknaam komt hiero"},{"day":"tuesday","startTime":"9:00","endTime":"18:00","courseName":"CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.","schoolLocation":"Liemers College","schoolAddress":"Straatnaam 123","classRoom":"1.2c","teacherName":"Naam van de Docent","subjectName":"vaknaam komt hiero"},{"day":"wednesday","startTime":"16:00","endTime":"18:00","courseName":"CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.","schoolLocation":"Liemers College","schoolAddress":"Straatnaam 123","classRoom":"1.2c","teacherName":"Naam van de Docent","subjectName":"vaknaam komt hiero"},{"day":"tuesday","startTime":"16:00","endTime":"18:00","courseName":"CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.","schoolLocation":"Liemers College","schoolAddress":"Straatnaam 123","classRoom":"1.2c","teacherName":"Naam van de Docent","subjectName":"vaknaam komt hiero"},{"day":"wednesday","startTime":"16:00","endTime":"17:00","courseName":"CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.","schoolLocation":"Liemers College","schoolAddress":"Straatnaam 123","classRoom":"1.2c","teacherName":"Naam van de Docent","subjectName":"vaknaam komt hiero"},{"day":"wednesday","startTime":"16:00","endTime":"19:00","courseName":"CourseName komt hiero. Merk op dat deze titels soms echt verschrikkelijk lang zijn. Echt veel te lang voor iedere layout.","schoolLocation":"Liemers College","schoolAddress":"Straatnaam 123","classRoom":"1.2c","teacherName":"Naam van de Docent","subjectName":"vaknaam komt hiero"}]
$(() => {
	$.getJSON("https://api.q-highschool.nl/api/function/schedule/2020/48", (data) => {
		console.log(data)

		renderData(testData)
	}).fail(() => {
		$("body").text("Er iets misgegaan bij het ophalen van de data.")
	})

	renderData = (data) => {
		data = orderAndSort(data)
		$("#monday").append(data["monday"].map((lesson) => createLesson(lesson)))
		$("#tuesday").append(data["tuesday"].map((lesson) => createLesson(lesson)))
		$("#wednesday").append(data["wednesday"].map((lesson) => createLesson(lesson)))
		$("#thursday").append(data["thursday"].map((lesson) => createLesson(lesson)))
		$("#friday").append(data["friday"].map((lesson) => createLesson(lesson)))
	}

	// sort lessons into weekdays and sort lessons within weekday based on startTime
	orderAndSort = (data) => {
		data = data.reduce((week, lesson) => {
			week[lesson.day].push(lesson)
			return week
		}, {"monday":[], "tuesday":[], "wednesday":[], "thursday":[], "friday":[]})
		Object.keys(data).map((day) => { 
			data[day].sort((a,b) => {
				comp = compareTime(a.startTime, b.startTime)
				if (comp == 0)
					return compareTime(a.endTime, b.endTime)
				return comp
			})
		})
		return data
	}

	compareTime = (timeA, timeB) => {
		// "7:00" -> "07:00"
		if (timeA.length == 4 )
			timeA = "0" + timeA
		if (timeB.length == 4)
			timeB = "0" + timeB
		
		return timeA > timeB ? 1 : (timeB > timeA ? -1 : 0)
	}

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