const Sequelize = require('sequelize');
const dbarg = require('../private/keys').databaseArgs;

const connection = new Sequelize(dbarg.database, dbarg.user, dbarg.password, {
	host: 'localhost',
	dialect: 'mysql',
});

connection.sync();

module.exports = connection;