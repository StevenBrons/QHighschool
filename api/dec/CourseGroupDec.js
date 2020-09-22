const Sequelize = require('sequelize');
const connection = require("./MainDec");
const Course = require("./CourseDec");

const CourseGroup = connection.define('course_group', {
	day: {
		type: Sequelize.STRING,
		validate: {
			isIn: [["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"]],
		},
	},
	period: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	schoolYear: {
		type: Sequelize.STRING,
		validate: {
			isIn: [["2017/2018", "2018/2019", "2019/2020", "2020/2021", "2021/2022", "2022/2023"]],
		},
	},
	enrollableFor: {
		type: Sequelize.STRING,
	},
	graphId: {
		type: Sequelize.STRING,
	},
}, {
		tableName: 'course_group'
	});

CourseGroup.belongsTo(Course);
Course.hasMany(CourseGroup);

module.exports = CourseGroup;