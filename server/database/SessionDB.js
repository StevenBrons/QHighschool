class SessionDB {

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getUserByEmail(email) {
		return this.mainDb.connection.query(
			"SELECT id,role FROM user_data WHERE email = ?",
			[email]
		).then((rows) => {
			if (rows.length === 1) {
				return rows[0]
			} else {
				return null;
			}
		});
	}

	async getUserByToken(token) {
		return this.mainDb.connection.query(
			"SELECT id, " +
			"email, " +
			"role, " +
			"displayName " +
			"FROM user_data " +
			"WHERE id IN " +
			"	 (SELECT userId " +
			"		FROM loggedin " +
			"		WHERE token = ? AND active = 1);",
			[token]
		).then(async (rows) => {
			if (rows.length === 1) {
				let user = rows[0];
				return this.mainDb.connection.query(
					"		SELECT  " +
					"				course_group.id " +
					"		FROM " +
					"				course_group " +
					"		WHERE " +
					"				course_group.id IN (SELECT  " +
					"								groupId " +
					"						FROM " +
					"								participant " +
					"						WHERE " +
					"								participant.userId = ?) ", [user.id])
					.then(rs => {
						user.groupIds = rs.map(row => row.id);
						return user;
					});
			} else {
				return null;
			}
		});
	}

	async createTokenForUser(profile) {
		const token = require('uuid/v4')();
		const q1 =
			"INSERT INTO loggedin (userId, token,ip,date,active) " +
			"VALUES ( " +
			"					(SELECT id " +
			"					 FROM user_data " +
			"					 WHERE email = ?),?,?,NOW(),1)";

		await this.destroySession(profile.upn);
		await this.mainDb.connection.query(q1, [profile.upn, token, profile._json.ipaddr]);

		return token;
	}

	async destroySession(email) {
		const q1 =
			"UPDATE loggedin " +
			"SET active=0 " +
			"WHERE userId = " +
			"    (SELECT id " +
			"     FROM user_data " +
			"     WHERE email = ?) ";
		return this.mainDb.connection.query(q1, [email]);
	}

}

module.exports = SessionDB;
