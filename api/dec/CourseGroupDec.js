const Sequelize = require('sequelize');
const connection = require("./MainDec");
const Course = require("./CourseDec");

const CourseGroup = connection.define('course_group', {
	day: {
		type: Sequelize.STRING,
		validate: {
			isIn: [["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag", "onbekend", "niet van toepassing"]],
		},
	},
	period: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	schoolYear: {
		type: Sequelize.STRING,
	},
	enrollableFor: {
		type: Sequelize.STRING,
	},
	graphId: {
		type: Sequelize.STRING,
	},
	startTime: {
		type: Sequelize.STRING,
	},
	endTime: {
		type: Sequelize.STRING,
	},
}, {
	tableName: 'course_group'
});

CourseGroup.belongsTo(Course);
Course.hasMany(CourseGroup);

module.exports = CourseGroup;