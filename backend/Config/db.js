const mysql = require('mysql');
const util = require('util');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: process.env.DB_TIMEZONE,
  charset: process.env.DB_CHARSET || 'utf8mb4' 
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to database:', err.stack);
    return;
  }
  console.log('Connected to database as id ' + db.threadId);
});

// แปลง callback query ให้เป็น promise
db.query = util.promisify(db.query);
db.beginTransaction = util.promisify(db.beginTransaction);
db.commit = util.promisify(db.commit);
db.rollback = util.promisify(db.rollback);

module.exports = db;
