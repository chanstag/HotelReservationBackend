var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const objIsEmpty = require('../utilfunctions').objIsEmpty;
const guid = require('../utilfunctions').guid;
var jwt = require('jsonwebtoken');

//Here's what I'm expecting  cust_id | fname | lname | bdate | pref_smoking | pref_pets

router.post('/', function(req, res){
    console.log(req.body);
    if(objIsEmpty(req.body)){
        return res.json({'status': false, 'message': "NO_"})
    }

    if(!req.body.fname && !req.body.lname && !req.body.bdate && !req.body.pref_smoking && !req.body.pref_pets){
        return res.json({'status': false, 'message': "ALL_INFO_NOT_PROVIDED"});
    }

    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
      });

    connection.connect();

    let sql = "INSERT INTO Customer (cust_id, fname, lname, bdate, pref_smoking, pref_pets, email, password) VALUES (?, ?, ?, ?, ?, ?, ? ,?)";
    let custInfo = []
    //add the guid here
    custInfo.push(guid());
    for(var attribute in req.body){
        console.log(attribute);
        // console.log(req.body[attribute]);
        // console.log(custInfo);
        custInfo.push(req.body[attribute]);
        console.log(custInfo);
    }
    console.log(custInfo);
    connection.query(sql, custInfo, function(error, results, fields){
        if(error){
            res.json({"status": false, "message": 0});
            return;
        }
        res.json({"status":true, "message": "SUCCESSFULLY_CREATED"});
        return;
    })
});


module.exports = router;