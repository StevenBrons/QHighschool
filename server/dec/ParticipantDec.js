const Sequelize = require('sequelize');
const connection = require("./MainDec");
const User = require("./UserDec");
const Group = require("./CourseGroupDec");

const Participant = connection.define('participant', {
	participatingRole: {
		type: Sequelize.STRING,
		defaultValue: "student",
		allowNull: false,
		validate: {
			isIn: [["student", "teacher"]],
		},
	},
	status: {
		type: Sequelize.TEXT,
		defaultValue: "active",
		allowNull: false,
		validate: {
			isIn: [["active"]],
		},
	},
}, {
	tableName: 'participant'
});

Participant.belongsTo(User);
Participant.belongsTo(Group);
Group.hasMany(Participant);

module.exports = Participant;

