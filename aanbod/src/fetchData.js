import $ from 'jquery';

export async function fetchGroups(handleError) {
	return $.ajax({
		// url: '/api/group/list',
		url: 'https://app.q-highschool.nl/api/group/list',
		type: 'get',
		dataType: 'json',
		error: handleError
	}).then(groups => {
		let groupsPerSubject = {}
		groups
			.filter(({ enrollable }) => enrollable)
			.forEach(g => {
				if (!groupsPerSubject[g.subjectName]) {
					groupsPerSubject[g.subjectName] = {};
				}
				groupsPerSubject[g.subjectName][g.id] = g;
			})
		return groupsPerSubject;
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
	})
}