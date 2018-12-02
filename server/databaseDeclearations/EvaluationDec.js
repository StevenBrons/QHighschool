const Sequelize = require('sequelize');
const connection = require("./MainDec");
const User = require("./UserDec");
const Course = require("./CourseDec");

const Evaluation = connection.define('evaluation', {
	type: {
		type: Sequelize.STRING,
		allowNull: false,
		isIn: [["decimal", "stepwise", "check"]],
	},
	assesment: {
		type: Sequelize.STRING,
	},
	explanation: {
		type: Sequelize.TEXT,
	}
}, {
		tableName: 'evaluation'
	});

Evaluation.belongsTo(User);
User.hasMany(Evaluation);

Evaluation.belongsTo(Course);
Course.hasMany(Evaluation);

module.exports = Evaluation;