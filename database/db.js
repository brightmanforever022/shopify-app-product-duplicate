const mysql = require("mysql");

const dbConfig = require('../config/db.config.js');
// const connection = mysql.createConnection({
//   host: dbConfig.host,
//   user: dbConfig.user,
//   password: dbConfig.password,
//   database: dbConfig.database
// });

const connection = mysql.createConnection(dbConfig.db_uri);

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection