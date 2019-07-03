const express = require("express");
const ejs = require('ejs');
const fs = require('fs');
const path = require("path");
const router = express.Router();

let groupDb, userDb;

router.init_temp = (gr) => {
	groupDb = gr;
}
router.init_temp2 = (user) => {
	userDb = user;
}

const testGroup = {
	id: '60',
	courseId: 22,
	day: 'maandag',
	period: 4,
	schoolYear: '2018/2019',
	enrollableFor: 'VWO 5 (en anderen)',
	courseName: 'HTML-De Basis',
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
		explanation: null,
		updatedAt: new Date(),
	}
}

const testGroup2 = {
	courseName: "Wat is het leven eigenlijk dat weet niemand want het is kut enz",
	studyTime: 50,
	evaluation: {
		type: 'stepwise',
		assesment: 'V',
		updatedAt: new Date(),
	}
}

const testGroup3 = {
	courseName: "Wat is het leven eigenlijk dat weet niemand want het is kut enz enz",
	studyTime: 24,
	evaluation: {
		type: 'stepwise',
		assesment: 'G',
		updatedAt: new Date(),
	}
}

const testGroup4 = {
	courseName: "HTML-Geavanceerd",
	studyTime: 44,
	evaluation: {
		type: 'check',
		assesment: 'failed',
		updatedAt: new Date(),
	}
}

const testUser = {
	id: 41,
	email: 'LC158871@ll.liemerscollege.nl',
	role: 'student',
	school: 'Liemers College',
	firstName: 'Janice Jannie Jannus',
	lastName: 'Jansen-Selten',
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

function distinctCourse(groups) {
	let courseIds = [];
	return groups.filter((group) => {
		if (courseIds.indexOf(group.courseId) === -1) {
			courseIds.push(group.courseId);
			return true;
		} else {
			return false;
		}
	});
}

function isCertificateWorthy({ evaluation }) {
	if (evaluation != null) {
		const assesment = evaluation.assesment;
		switch (evaluation.type) {
			case "decimal":
				const x = assesment.replace(/\./g, "_$comma$_").replace(/,/g, ".").replace(/_\$comma\$_/g, ",");
				return x >= 5.5;
			case "stepwise":
				return assesment === "G" || assesment === "V";
			case "check":
				return assesment === "passed";
		}
	}
	return false;
}

router.get("/portfolio/:userId/", async (req, res) => {
	if (req.user.isAdmin()) {
		const userId = req.params.userId;
		if (userId === "all") {
			res.render("totalPortfolio");
		} else {
			let user = await userDb.getUser(userId);
			let groups = await groupDb.getGroups(userId);
			groups = groups.filter(isCertificateWorthy);
			groups = distinctCourse(groups);
			res.render("portfolioCertificate", {
				user,
				groups,
			});
		}
	}
});

router.get("/course/:courseId/:userId", (req, res) => {
	const groupId = req.params.groupId;
	const userId = req.params.userId;
	res.render("courseCertificate", {
		user: testUser,
		group: testGroup
	});
});

module.exports = router;