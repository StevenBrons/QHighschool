const course = {
	"Linux": {
	},
	"Processing": {
	},
	"Webdesign": {
	},
	"Basis van Programmeren": {
	},
	"Python": {
	},
	"Security": {
	},
	"Image editing": {
	},
};


function toDom(course) {
	const url = course.key.replace(/ /g, '%20')
	return $(`
	<a class=\"GroupCard\" href=\"./module/${url}/syllabus.html" style=\"background-image: url(./module/${url}/media/image1.jpg),url(./module/${url}/media/image1.jpeg),url(./module/${url}/media/image1.png)\">
		<h2>
			${course.key}
		</h2>
	</a>
	`)
}

$(document).ready(() => {
	const courses = Object.keys(course)
		.map((key) => { return { ...course[key], key } })
		.map(toDom);
	$("#courses").append(courses);
});