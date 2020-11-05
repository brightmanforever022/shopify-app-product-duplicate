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

setInterval(function() {
  connection.query('SELECT id FROM stores LIMIT 1', function(err, results) {
      if (err) console.log('SELECT the first store: ', err.code);
      else console.log('SELECT the first store: ', results);
  });
}, 10000);

module.exports = connection