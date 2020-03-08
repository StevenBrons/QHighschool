const Sequelize = require('sequelize');
const connection = require("./MainDec");

module.exports = connection.define('subject', {
	name: {
		type: Sequelize.STRING,
	},
	description: {
		type: Sequelize.TEXT,
	},
	abbreviation: {
		type: Sequelize.TEXT,
	},
	canDoExam: {
		type: Sequelize.BOOLEAN
	}
}, {
	tableName: 'school_subject'
});
