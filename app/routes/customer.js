var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const objIsEmpty = require('../utilfunctions').objIsEmpty;
const guid = require('../utilfunctions').guid;
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  
  router.post('/updateCustomer', function(req, res){
    console.log(req.body);
    if(objIsEmpty(req.body)){
        return res.json({'status': false, 'message': "NO_INFO_PROVIDED"})
    }
    
    //need to do a check that it is a valid date object

    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
    });

    connection.connect();

    let updateInfo = []
    let sqlBegin = 'UPDATE Customer SET ';
    let sqlEnd = 'WHERE email = ?'
    for(let info in req.body){
        if(info == "email"){
            continue;
        }
        sqlBegin += info + "=" + req.body[info] + " ";
    }
    let sql = sqlBegin + sqlEnd
    console.log(sql);

    connection.query(sql, [req.body.email],  function (error, results, fields) {
    if (error) {
        res.json({'status':false, 'message': 11})
        throw error;
    }
        console.log('The solution is: ', results);
        console.log(results.changedRows);
       res.json({'status': true, 'message': "INFO_UPDATED"});
       return
        
    });
  });
  
  router.post('/getCustomerById', function(req, res){
    console.log(req.body);
    if(objIsEmpty(req.body) && !req.body.date){
        return res.json({'status': false, 'message': "NO_DATE_PROVIDED"})
    }
  
    //need to do a check that it is a valid date object
  
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
      });
  
    connection.connect();
  
    sql = "select * from Customer where Customer.cust_id = ?"
    connection.query(sql, [req.body.id],  function (error, results, fields) {
    if (error) throw error;
        console.log('The solution is: ', results);
        res.json({'status':true, 'message':results});
    });
  });

  router.post('/getCustomerByEmail', function(req, res){
    console.log(req.body);
    if(objIsEmpty(req.body) && !req.body.email){
        return res.json({'status': false, 'message': "NO_DATE_PROVIDED"})
    }
  
    //need to do a check that it is a valid date object
  
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
      });
  
    connection.connect();
  
    sql = "select * from Customer where Customer.email = ?"
    connection.query(sql, [req.body.email],  function (error, results, fields) {
    if (error) throw error;
        console.log('The solution is: ', results);
        res.json({'status':true, 'message':results});
    });
  });

  
  module.exports = router;