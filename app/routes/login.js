var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const objIsEmpty = require('../utilfunctions').objIsEmpty;
const guid = require('../utilfunctions').guid;
var jwt = require('jsonwebtoken');



router.post('/', function(req, res, next){
    console.log(req.body);
    if(objIsEmpty(req.body)){
        return res.json({'status': false, 'message': 3})
    }
    if(!req.body.password && !req.body.password){
        return res.json({'status': false, 'message': 3});
    }
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
    });

    connection.connect();

    let sql = "SELECT  * FROM Customer WHERE email = ? LIMIT 1";
    connection.query(sql, [req.body.email], function(error, results, fields){
        if(error){
            res.json({"status": false, "message": 0});
            return;
        }
        if(results.length == 0){
            res.json({"status": false, "message": 9});
            return;
        }
        if(results[0].password == req.body.password){
            var token = jwt.sign({ email: req.body.email }, 'CS443');
            return res.json({"status": true, "message": token});
        }
    })

    
});

//check if token is valid
router.get('/authenticate', function(req, res, next){
    console.log(req.headers);
    token = req.headers['authorization'];
    console.log(token);
    
    let decoded;
    try{
        decoded = jwt.verify(token, "CS443");
        console.log(decoded);
        res.json({"status": true, "message": req.headers['authorization']});
    }
    catch(err){
        if(err){
            console.log(err)
            return res.json({'status': false, "message": 8});
        }
    }
    
});

module.exports = router;