const mysql = require("mysql");

const dbConfig = require('../config/db.config.js');
// const connection = mysql.createConnection({
//   host: dbConfig.host,
//   user: dbConfig.user,
//   password: dbConfig.password,
//   database: dbConfig.database
// });

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig.db_uri);
  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection