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
		const assesment = evaluation.assesment + "";
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

async function getCertificateFromUserId(userId) {
	let user = await userDb.getUser(userId);
	let groups = await groupDb.getGroups(userId);
	console.log(groups);
	groups = groups.filter(isCertificateWorthy);
	console.log(groups);
	groups = groups.filter(tempAvonturenFilter); //TEMP
	groups = distinctCourse(groups);
	return {
		user,
		groups,
	}
}

function tempFilter({ user, groups }) {
	if (user.year === 6 && user.level === "VWO") return false;
	if (user.year === 5 && user.level === "HAVO") return false;
	if (user.school === "Lyceum Elst") return false;
	const nonAvonturen = groups.filter((group) => {
		return group.subjectName !== "Avonturen";
	});
	if (nonAvonturen.length === 0) return false;
	return true;
}

function tempAvonturenFilter(group) {
	return group.subjectName !== "Avonturen";
}

router.get("/portfolio/all/:from", async (req, res) => {
	if (req.user.isAdmin()) {
		const start = parseInt(req.params.from);
		const allUsers = await userDb.getList();
		const end = start + 50;

		const curUsers = allUsers.filter((_, i) => i >= start && i <= end);
		const allCertificateObjects = await Promise.all(curUsers.map(({ id }) => getCertificateFromUserId(id)));
		res.render("multipleCertificates", {
			certificates: allCertificateObjects.filter(tempFilter), //FILTER TEMP
			courseCertificates: false
		});
	}
});


router.get("/portfolio/:userId", async (req, res) => {
	if (req.user.isAdmin()) {
		const userId = req.params.userId;
		res.render("multipleCertificates", {
			certificates: [await getCertificateFromUserId(userId)],
			courseCertificates: false
		});
	}
});

router.get("/course/:courseId/:userId", (req, res) => {
	const groupId = req.params.groupId;
	const userId = req.params.userId;
	res.render("multipleCertificates", {
		certificates: [{ user: testUser, groups: [testGroup2, testGroup2, testGroup3] }],
		courseCertificates: true,
	});
});

module.exports = router;