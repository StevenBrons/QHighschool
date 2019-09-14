import $ from 'jquery';

export default async function fetchData() {
	return $.ajax({
		url: '/api/group/list',
		type: 'get',
		dataType: 'json'
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