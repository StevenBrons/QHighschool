const Sequelize = require('sequelize');
const connection = require("./MainDec");

module.exports = connection.define('subject', {
	name: {
		type: Sequelize.STRING,
	},
	description: {
		type: Sequelize.TEXT,
	},
}, {
		tableName: 'school_subject'
	});
