const Sequelize = require('sequelize');
const connection = require("./MainDec");
const User = require("./UserDec");

const Notification = connection.define('notification', {
	priority: {
		type: Sequelize.TEXT,
		validate: {
			isIn: [["low", "medium", "high"]],
		},
	},
	scope: {
		type: Sequelize.TEXT,
	},
	message: {
		type: Sequelize.TEXT,
	},
	type: {
		type: Sequelize.TEXT,
		validate: {
			isIn: [["bar", "alert"]],
		},
	}
}, {
		tableName: 'notification'
	});

Notification.belongsTo(User);
User.hasMany(Notification);

module.exports = Notification;