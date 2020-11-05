const mysql = require("mysql");
require('dotenv').config()

// const dbConfig = require('../config/db.config.js');
// const connection = mysql.createConnection({
//   host: dbConfig.host,
//   user: dbConfig.user,
//   password: dbConfig.password,
//   database: dbConfig.database
// });

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  
  connection.on('error', function(err) {
    handleDisconnect();    
  });
}

handleDisconnect();

module.exports = connection