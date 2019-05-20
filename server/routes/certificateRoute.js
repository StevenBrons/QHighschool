const express = require("express");
const router = express.Router();

const testGroup = {
	id: '60',
	courseId: 22,
	day: 'maandag',
	period: 4,
	schoolYear: '2018/2019',
	enrollableFor: 'VWO 5 (en anderen)',
	courseName: 'Artificial Intelligence',
	courseDescription: 'Wanneer apparatuur of software reageert op data of signalen uit de omgeving en op basis daarvan zelfstandig beslissingen neemt, spreken we over artificial intelligence ofwel kunstmatige intelligentie. Tijdens deze module maak je kennis met de (on)mogelijkheden van kunstmatige intelligentie. \nDe module bestaat vooral uit een online cursus die je geheel zelfstandig doorwerkt, en één of twee bijeenkomsten waarin je leert waarom kunstmatige intelligentie nog niet zo vanzelfsprekend is als het lijkt. Als je aan het werk wilt met kunstmatige intelligentie, moet je ook meer weten over het menselijke brein: over neurologie en psychologie bijvoorbeeld. Daaraan wordt tijdens de module ook aandacht besteed.',
	remarks: '',
	studyTime: 24,
	subjectId: 8,
	subjectName: 'Informatica',
	subjectDescription: null,
	teacherId: null,
	teacherName: null,
	evaluation: {
		id: 378,
		userId: 41,
		courseId: 22,
		type: 'decimal',
		assesment: 10,
		explanation: null
	}
}

const testUser = {
	id: 41,
	email: 'LC158871@ll.liemerscollege.nl',
	role: 'student',
	school: 'Liemers College',
	firstName: 'Janice',
	lastName: 'Selten',
	year: 4,
	level: 'VWO',
	preferedEmail: 'j.selten@ll.liemerscollege.nl',
	profile: 'CM',
	phoneNumber: '0620588970',
	displayName: 'Selten, Janice',
	createIp: '77.250.108.146',
	createdAt: '2018-10-11T16:03:49.000Z',
	updatedAt: null,
	notifications: [],
}

router.get("/:userId/:groupId", function (req, res) {
	const userId = req.params.userId;
	const groupId = req.params.groupId;
	if (groupId != null) {
		res.render("courseCertificate", {
			user: testUser,
			group: testGroup
		});
	} else {
		res.render("portfolioCertificate", {
			user: testUser,
			groups: [testGroup, testGroup, testGroup, testGroup, testGroup],
		});
	}
});



module.exports = router;