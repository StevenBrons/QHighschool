import $ from 'jquery';

export default async function fetchData() {
	$.ajax({
		url: '/api/group/list',
		type: 'get',
		data: null,
		dataType: 'json'
	}).then(list => {
		console.log('success:', list);
	})
}