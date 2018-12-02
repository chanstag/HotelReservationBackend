var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const objIsEmpty = require('../utilfunctions').objIsEmpty;
const getMonthDateRange = require('../utilfunctions').getMonthDateRange;

const moment = require('moment');



//assume incoming data looks like this {room_size:{smallest: VAL, largest: VAL} (AND/OR) price:{smallest: VAL, largest: VAL}}
router.post('/filterRoom', function(req, res){
    console.log(req.body);
    if(objIsEmpty(req.body) && !req.body.room_size){
        return res.json({'status': false, 'message': "SIZE_AND/OR_PRICE_NOT_PROVIDED"})
    }

    
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
      });

    connection.connect();

    let firstsql = "SELECT roomNo, room_size, price FROM Room_info WHERE ";
    let secondsql = "SELECT reserve_date AS reservedDates, roomNo FROM Reservation WHERE reserve_date BETWEEN ? AND ? AND roomNo IN ?"
    let options = [];
    let start = {};
    let end = {};
    
    for(let filter in req.body){
        if(filter == "date"){
            start = new moment(req.body[filter].start, "MM/DD/YYYY");
            end = new moment(req.body[filter].end, "MM/DD/YYYY");
        }
        else{
            console.log(filter);
            console.log(typeof(filter));
            firstsql += filter + " BETWEEN ? AND ? AND ";
            let smallest = parseFloat(req.body[filter].smallest);
            let largest = parseFloat(req.body[filter].largest)
            if(isNaN(smallest) || isNaN(largest)){
                res.json({"status": false, 'message':7})
                return;
            }
            else{
                options.push(smallest);
                options.push(largest); 
            }
            
        }
        
    }
    firstsql = firstsql.slice(0, firstsql.length-4)
    
    console.log(firstsql);
    console.log(...options);
  
    connection.query(firstsql, [...options], function (error, results, fields) {
        if (error){
            res.json({'status': false, 'message':5});
            // throw error;
            return;
        } 
        console.log('The solution is: ', results);
        let rooms = [];
        for(room of results){
            rooms.push(parseInt(room.roomNo));
        }
        console.log("rooms", rooms);
        console.log(secondsql);
        connection.query(secondsql, [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"), [rooms]], function(error2, results2, fields){
            if (error2){
                return res.json({'status': false, 'message':6});
            } 
            console.log(results2);
            res.json({'status':true, 'message':[results, results2]});
            return;
        })
    }); 

});


router.get('/getAllRooms', function(req, res){
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
      });

    connection.connect();

    let sql = "SELECT roomNo, room_size, price FROM Room_info";
    connection.query(sql, function(error, results, fields){
        if(error){
            if (error2){
                return res.json({'status': false, 'message':6});
            } 
        }

        return res.json({
            'status': true,
            'message': results
        });
    })
});



module.exports = router;