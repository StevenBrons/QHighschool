const Sequelize = require('sequelize');
const connection = require("./MainDec");

module.exports = connection.define('user', {
	email: {
		type: Sequelize.STRING,
		validate: {
			isEmail: true,
		},
		allowNull: false,
	},
	role: {
		type: Sequelize.STRING,
		allowNull: false,
		defaultValue: "student",
	},
	school: {
		type: Sequelize.STRING,
	},
	firstName: {
		type: Sequelize.STRING,
	},
	lastName: {
		type: Sequelize.STRING,
	},
	year: {
		type: Sequelize.STRING,
	},
	level: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	preferedEmail: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	profile: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	schoolLocation: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	remarks: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	phoneNumber: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	displayName: {
		type: Sequelize.STRING,
	},
	createIp: {
		type: Sequelize.STRING,
	},
}, {
	tableName: 'user_data'
});
