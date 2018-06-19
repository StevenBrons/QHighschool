const mysql = require('promise-mysql');

class Database {
  async connect(connectionArgs) {
    this.connection = await mysql.createConnection(connectionArgs);
  }

}

module.exports = Database;
