const Sequelize = require('sequelize');
const connection = require("./MainDec");
const User = require("./UserDec");
const Lesson = require("./LessonDec");

const Presence = connection.define('presence', {
	status: {
		type: Sequelize.STRING,
		allowNull: true,
		isIn: [["present", "absent"]],
	},
	explanation: Sequelize.TEXT,
}, {
		tableName: 'presence'
	});

Presence.belongsTo(User);
User.hasMany(Presence);

Presence.belongsTo(Lesson);
Lesson.hasMany(Presence);

module.exports = Presence;