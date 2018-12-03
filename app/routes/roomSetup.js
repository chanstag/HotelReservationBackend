var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const objIsEmpty = require('../utilfunctions').objIsEmpty

router.post('/', function(req, res){
    console.log(req.body);
    if(objIsEmpty(req.body)){
        return res.json({'status': false, 'message': 'NO_ROOM_NUMBER_PROVIDED'});
    }

    if(!req.body.roomNo){
        return res.json({'status': false, 'message': "NO_ROOM_NO_PROVIDED"});
    }

    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
    });


    connection.connect();


    let sql = "SELECT bed, windows FROM Room_setup, Room_info WHERE Room_info.RoomNo = ? AND Room_info.setupID = Room_setup.setupID";
    connection.query(sql, [req.body.roomNo],  function (error, results, fields) {
        if(error) throw error;

        return res.json({'status': true, 'message': results});
    });
});

module.exports = router;