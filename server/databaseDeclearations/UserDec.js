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
		type: Sequelize.INTEGER,
		validate: {
			min: 1,
			max: 6,
		}
	},
	level: {
		type: Sequelize.STRING,
		validate: {
			isIn: [["MAVO", "HAVO", "VWO"]],
		},
	},
	preferedEmail: {
		type: Sequelize.STRING,
		validate: {
			isEmail: true,
		},
		allowNull: false,
	},
	profile: {
		type: Sequelize.STRING,
		validate: {
			isIn: [["NT", "NG", "EM","CM","NT&NG","EM&CM"]],
		},
	},
	phoneNumber: {
		type: Sequelize.STRING,
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
