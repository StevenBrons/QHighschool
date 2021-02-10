const Sequelize = require('sequelize');
const connection = require("./MainDec");
const Group = require("./CourseGroupDec");

const Lesson = connection.define('lesson', {
	date: Sequelize.DATE,
	kind: Sequelize.STRING,
	activities: Sequelize.TEXT,
	numberInBlock: Sequelize.INTEGER,
	subject: Sequelize.TEXT,
	location: Sequelize.TEXT,
	room: Sequelize.TEXT,
	presence: {
		type: Sequelize.STRING,
		isIn: [["required", "optional", "unrequired"]],
	},
}, {
	tableName: 'lesson'
});

Lesson.belongsTo(Group);
Group.hasMany(Lesson);

module.exports = Lesson;