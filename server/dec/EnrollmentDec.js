const Sequelize = require('sequelize');
const connection = require("./MainDec");
const User = require("./UserDec");
const CourseGroup = require("./CourseGroupDec");

const Enrollment = connection.define('enrollment', {
	accepted: {
		type: Sequelize.STRING,
		defaultValue: "false",
		validate: {
			isIn: [["true", "false"]],
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