const Sequelize = require('sequelize');
const connection = require("./MainDec");
const Subject = require("./SubjectDec");
const groupTeamApi = require("../office/groupTeamApi");

const Course = connection.define('course', {
	name: {
		type: Sequelize.STRING,
	},
	description: {
		type: Sequelize.TEXT,
	},
	remarks: {
		type: Sequelize.TEXT,
	},
	studyTime: {
		type: Sequelize.INTEGER,
	}
}, {
		tableName: 'course'
	});

Course.belongsTo(Subject);
Subject.hasMany(Course);

Course.afterUpdate(groupTeamApi.updateCourse);

module.exports = Course;