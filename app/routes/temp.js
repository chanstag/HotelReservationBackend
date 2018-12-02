var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER1,
  password : process.env.MYSQL_PASS1,
  database : 'temp'
});

 
connection.connect();
 
connection.query('SELECT * FROM temp', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});
 
connection.end();
