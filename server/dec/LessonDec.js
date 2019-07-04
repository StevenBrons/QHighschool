const Sequelize = require('sequelize');
const connection = require("./MainDec");
const Group = require("./CourseGroupDec");
const groupTeamApi = require("../office/groupTeamApi");

const Lesson = connection.define('lesson', {
	date: Sequelize.DATE,
	kind: Sequelize.STRING,
	activities: Sequelize.TEXT,
	numberInBlock: Sequelize.INTEGER,
	subject: Sequelize.TEXT,
	presence: {
		type: Sequelize.STRING,
		isIn: [["required", "optional", "unrequired"]],
	},
}, {
		tableName: 'lesson'
	});

Lesson.belongsTo(Group);
Group.hasMany(Lesson);

Lesson.afterUpdate(groupTeamApi.updateLesson);
Lesson.afterCreate(groupTeamApi.updateLesson);

module.exports = Lesson;