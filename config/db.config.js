require('dotenv').config()

module.exports = {
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  db_uri: process.env.CLEARDB_DATABASE_URL,
}