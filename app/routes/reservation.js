var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const objIsEmpty = require('../utilfunctions').objIsEmpty;
const getMonthDateRange = require('../utilfunctions').getMonthDateRange;

const moment = require('moment');



router.post('/makeReservation', function(req, res){
    console.log("req.body", req.body)
    if(objIsEmpty(req.body)){
        return res.json({'status': false, 'message': 3})
    }

    if(!req.body.email && !req.body.roomNo && !req.body.reserve_date && !req.body.check_out_date){
        return res.json({'status': false, 'message': 4})
    }

    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
      });

    connection.connect();

    let constraintsql = " SELECT * FROM Reservation WHERE (? >= reserve_date  AND  ? <= check_out_date  AND ? >= reserve_date  AND ? <= check_out_date) OR ( ? <= reserve_date AND ? <= check_out_date AND ? >= reserve_date AND ? >= check_out_date) AND roomNo = ?;";
    let sql = "INSERT INTO Reservation(cust_id, roomNo, reserve_date, check_out_date) VALUES ((SELECT cust_id FROM Customer WHERE email = ?), ?, ?, ?)"
    //Ideally would do a check on input parameters to ensure of correct type and format
	console.log("date: ", new moment(req.body.reserve_date).format("YYYY-MM-DD"))
	reserDate = 
    connection.query(constraintsql, [new moment(req.body.reserve_date).format("YYYY-MM-DD"), new moment(req.body.reserve_date).format("YYYY-MM-DD"),new moment(req.body.check_out_date).format("YYYY-MM-DD"),new moment(req.body.check_out_date).format("YYYY-MM-DD"),new moment(req.body.reserve_date).format("YYYY-MM-DD"),new moment(req.body.reserve_date).format("YYYY-MM-DD"),new moment(req.body.check_out_date).format("YYYY-MM-DD"),new moment(req.body.check_out_date).format("YYYY-MM-DD"), req.body.roomNo], function(error, results, fields){
        if(error){
            console.log(error);
            return res.json({'status': false, 'message': 10});
        }
        console.log("results", results);
        if( typeof(results) == "undefined" || results.length > 0){
            console.log("results", results);
            return res.json({'status': false, 'message': 10});
        }
	console.log(req.body.email, req.body.roomNo, req.body.reserve_date, req.body.check_out_date);
        connection.query(sql, [req.body.email, req.body.roomNo, new moment(req.body.reserve_date).format("YYYY-MM-DD"), new moment(req.body.check_out_date).format("YYYY-MM_DD")],  function (error, results, fields) {
            if (error) {
		console.log(error)
		if(error.code == 'ER_DUP_ENTRY'){
			console.log(error);	
                	return res.json({'status':false, 'message': 13});
		}
                res.json({'status':false, 'message': 12});
                return;
            }
            if(results.affectedRows > 0){
                
                res.json({'status': true, 'message': results});
            }
            else{
                res.json({'status': false, 'message': 12});
            }
            
        });
    })
    
});

//this is a customer API endpoint
router.post('/', function(req, res){
    console.log(req.body)
    if(objIsEmpty(req.body)){
        return res.json({'status': false, 'message': "NO_RESERVATION_ID_OR_USERNAME_PROVIDED"})
    }

    if(!req.body.id){
        return res.json({'status': false, 'message': "NO_ID_PROVIDED"});
    }

    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
      });

      connection.connect();

    let sql = 'SELECT roomNo, check_in_date, reserve_date, check_out_date from Reservation WHERE Reservation.cust_id = ?'
    connection.query(sql, [req.body.id],  function (error, results, fields) {
    if (error) {
        res.json({'status': false, 'message': 9});
    }
        console.log('The solution is: ', results);
        res.json({'status':true, 'message':results});
    });
});

/**
 * get reservations for that date and number of for that date
 * @param date - date to retrieve all reservations
 */
router.post('/getNumReservations', function(req, res){
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

    sql = "select *, (SELECT COUNT(*) from Reservation where reserve_date = ?) as count from Reservation where Reservation.reserve_date = ? GROUP BY cust_id"
    connection.query(sql, [req.body.date, req.body.date],  function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
        res.json({'status':true, 'message':results});
    });


});

router.post('/getAllReservations', function(req, res){
    console.log(req.body);
    if(objIsEmpty(req.body) && !req.body.startDate && !req.body.endDate){
        return res.json({'status': false, 'message': "NO_DATE_PROVIDED"})
    }

    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER1,
        password : process.env.MYSQL_PASS1,
        database : 'HotelManagement'
      });

    connection.connect();

   let startDate = new moment(req.body.startDate, "MM/DD/YYYY");
   let endDate = new moment(req.body.endDate, "MM/DD/YYYY");
   startDate.subtract(2, 'days');
   endDate.add(2, 'days');

   console.log(startDate);
   console.log(endDate);
   
    let sql = "SELECT * FROM Reservation WHERE reserve_date between ? AND ?";
    connection.query(sql, [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")], function(error, results, fields){
        if (error){
            res.json({'status':false, "message": 2});
            throw error;
        } 
        res.json({'status':true, 'message':results});
    })
});






module.exports = router;
