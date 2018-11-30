const Sequelize = require('sequelize');
const connection = require("./MainDec");
const User = require("./UserDec");
const CourseGroup = require("./CourseGroupDec");

const Enrollment = connection.define('enrollment', {
	accepted: {
		type: Sequelize.STRING,
		validate: {
			isIn: [["true", "false"]],
			defaultValue: "true",
		},
	},
}, {
		tableName: 'enrollment'
	});

Enrollment.belongsTo(User);
User.hasMany(Enrollment);

Enrollment.belongsTo(CourseGroup);
CourseGroup.hasMany(Enrollment);

module.exports = Enrollment;