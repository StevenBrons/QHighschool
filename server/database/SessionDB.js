class SessionDB {

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async createUser(profile) {

		let user = {
			email: profile.upn,
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			displayName: profile.displayName,
			school: null,
			role: "student",
		}

		if (/beekdallyceum\.nl$/g.test(user.email)) { user.school = "Beekdal" };
		if (/candea\.nl$/g.test(user.email)) { user.school = "Candea College" };
		if (/quadraam\.nl$/g.test(user.email)) { user.school = "Centraal Bureau" };
		if (/lyceumelst\.nl$/g.test(user.email)) { user.school = "Lyceum Elst" };
		if (/liemerscollege\.nl$/g.test(user.email)) { user.school = "Liemers College" };
		if (/lorentzlyceum\.nl$/g.test(user.email)) { user.school = "Lorentz Lyceum" };
		if (/maartenvanrossem\.nl$/g.test(user.email)) { user.school = "Maarten van Rossem" };
		if (/montessoriarnhem\.nl$/g.test(user.email)) { user.school = "Montessori College" };
		if (/olympuscollege\.nl$/g.test(user.email)) { user.school = "Olympus College" };
		if (/produsarnhem\.nl$/g.test(user.email)) { user.school = "Produs" };
		if (/gymnasiumarnhem\.nl$/g.test(user.email)) { user.school = "Stedelijk Gymnasium Arnhem" };
		if (/symbion-vo\.nl$/g.test(user.email)) { user.school = "Symbion" };
		if (/vmbo-venster\.nl$/g.test(user.email)) { user.school = "'t Venster" };
		if (/hetwesteraam\.nl$/g.test(user.email)) { user.school = "Het Westeraam" };

		if (user.school == null) {
			throw new Error("WRONG EMAIL");
		}

		if (
			!(/ll\.beekdallyceum\.nl$/g.test(user.email)) &&
			!(/ll\.candea\.nl$/g.test(user.email)) &&
			!(/ll\.quadraam\.nl$/g.test(user.email)) &&
			!(/ll\.lyceumelst\.nl$/g.test(user.email)) &&
			!(/ll\.liemerscollege\.nl$/g.test(user.email)) &&
			!(/ll\.lorentzlyceum\.nl$/g.test(user.email)) &&
			!(/ll\.maartenvanrossem\.nl$/g.test(user.email)) &&
			!(/ll\.montessoriarnhem\.nl$/g.test(user.email)) &&
			!(/ll\.olympuscollege\.nl$/g.test(user.email)) &&
			!(/ll\.produsarnhem\.nl$/g.test(user.email)) &&
			!(/ll\.gymnasiumarnhem\.nl$/g.test(user.email)) &&
			!(/ll\.symbion-vo\.nl$/g.test(user.email)) &&
			!(/ll\.vmbo-venster\.nl$/g.test(user.email)) &&
			!(/ll\.hetwesteraam\.nl$/g.test(user.email))
		) {
			user.role = "teacher";
		}

		return this.mainDb.connection.query(
			"INSERT INTO user_data " +
			"(email,role,firstName,lastName,displayName,school,createIp,createDate) VALUES" +
			"(?,?,?,?,?,?,?,NOW())",
			[user.email, user.role, user.firstName, user.lastName, user.displayName, user.school, profile._json.ipaddr]
		).then(() => {
			return user;
		});

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
			"		WHERE token = ?) ",
			[token]
		).then((rows) => {
			if (rows.length === 1) {
				return rows[0];
			}else {
				return null;
			}
		});
	}

	async createTokenForUser(profile) {
		const token = require('uuid/v4')();
		return this.mainDb.connection.query(
			"INSERT INTO loggedin (userId, token) " +
			"VALUES ( " +
			"					(SELECT id " +
			"					 FROM user_data " +
			"					 WHERE email = ?),?)",
			[profile.upn, token]
		).then(() => {
			return token;
		})
	}

	async destroySession(token, groupId) {
		return this.mainDb.connection.query(
			"INSERT INTO enrollment " +
			"(studentId,groupId) VALUES" +
			"((SELECT id FROM loggedin WHERE token = ?) ,?)",
			[token, groupId]
		);
	}

}

module.exports = SessionDB;
