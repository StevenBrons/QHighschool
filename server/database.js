const mysql = require('promise-mysql');

class InvalidTokenError extends Error {
  constructor(unset) {
    if (unset === true) {
      super("Token unset");
    }else {
      super("Invalid token");
    }
  }
}

class Database {
  async connect(connectionArgs) {
    this.connection = await mysql.createConnection(connectionArgs);
  }

  async getUser(token) {
    return this.connection.query('SELECT * FROM user WHERE id IN (SELECT id FROM loggedin WHERE token = ?);', [token]).then((users) => {
      if (users.length == 1) {
        return users[0];
      } else {
        return this.checkToken(token);
      }
    });
  }

  async checkToken(token) {
    if (token == null || token == "") {
      throw new InvalidTokenError(true);
    }
    return this.connection.query('SELECT id FROM loggedin WHERE token = ?', [token]).then((id) => {
      if (id.length !== 1) {
        throw new InvalidTokenError();
      }
    });
  }

  async getChoice(token) {
    return this.connection.query('SELECT * FROM choice WHERE student IN (SELECT id FROM loggedin WHERE token = ?)', [token]).then(async (choice) => {
      if (choice.length == 1) {
        return choice[0];
      } else {
        await this.checkToken(token);
        return null;
      }
    });
  }

  async getCourses() {
    return this.connection.query('SELECT * FROM course;');
  }



}

module.exports = new Database();
