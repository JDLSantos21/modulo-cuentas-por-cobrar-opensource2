const mysql = require('promise-mysql');


const connection = mysql.createConnection({
  host: 'sql5.freesqldatabase.com',
  user: 'sql5504507',
  password: 't6WGBqm8tH',
  database: 'sql5504507'
})

function getConnection() {
  return connection;
}

module.exports = {getConnection};
