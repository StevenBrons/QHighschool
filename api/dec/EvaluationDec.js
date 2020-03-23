const Sequelize = require('sequelize');
const connection = require("./MainDec");
const User = require("./UserDec");
const Course = require("./CourseDec");

const Evaluation = connection.define('evaluation', {
	type: {
		type: Sequelize.STRING,
		allowNull: false,
		isIn: [["decimal", "stepwise", "check"]],
		defaultValue: "decimal",
	},
	assesment: Sequelize.STRING,
	// --- database  ------ dutch
	//	  check							vink ======================
	//		failed
	//		passed

	//		decimal						cijfer ==================
	//		1.0-10.0

	//		stepwise					trapsgewijs ===============
	//		O									onvoldoende
	// 		V									voldoende
	//    G									goed
	//		"" or NULL				onbekend
	//		ND								niet deelgenomen

	explanation: Sequelize.TEXT,
}, {
	tableName: 'evaluation'
});

Evaluation.belongsTo(User);
User.hasMany(Evaluation);

Evaluation.belongsTo(Course);
Course.hasMany(Evaluation);

Evaluation.belongsTo(User, {
	as: "updatedByUser",
});

module.exports = Evaluation;