const Sequelize = require('sequelize');
const connection = require("./MainDec");
const Subject = require("./SubjectDec");

const Course = connection.define('course', {
	name: {
		type: Sequelize.STRING,
	},
	description: {
		type: Sequelize.TEXT,
	},
	foreknowledge: {
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

module.exports = Course;