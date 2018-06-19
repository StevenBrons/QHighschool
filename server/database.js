const mysql = require('promise-mysql');

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
}

module.exports = Database;
