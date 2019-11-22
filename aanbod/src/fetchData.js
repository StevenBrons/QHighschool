import $ from 'jquery';

export async function fetchCourses(handleError) {
	return $.ajax({
		// url: '/api/group/list',
		url: 'https://app.q-highschool.nl/api/group/list',
		type: 'get',
		dataType: 'json',
		error: handleError
	}).then(courses => {
		let coursesPerSubject = {}
		courses.forEach(c => {
			if (!coursesPerSubject[c.subjectName]){
				coursesPerSubject[c.subjectName] = {};
			}
			coursesPerSubject[c.subjectName][c.id] = c;
		})
		return coursesPerSubject;
	})
}

export async function fetchSubjectInformation(handleError) {
	return $.ajax({
		// url: '/api/subject/list',
		url: 'https://app.q-highschool.nl/api/subject/list',
		type: 'get',
		dataType: 'json',
		error: handleError
	}).then(subjects => {
		let informationPerSubject = {};
		subjects.forEach(s => {
			informationPerSubject[s.name] = s.description;
		})
		return informationPerSubject;
	} )
}