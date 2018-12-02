var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var customerRouter = require('./routes/customer');
var reservationRouter = require('./routes/reservation.js');
var roomInfoRouter = require('./routes/roomInfo.js');
var loginRouter = require("./routes/login");
var registerRouter = require("./routes/register");

var app = express();

const port = 3002

app.use(logger('dev'));
app.use(cors({allowedHeaders:['Authorization']}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', loginRouter);
app.use('/register', registerRouter);
// app.use(function(req, res, next){
//     if(!req.body.token){
//         return res.json({"status": false, "message": 8});
//     }
//     else{
//         try {
//             var decoded = jwt.verify(req.body.token, 'wrong-secret');
//             req.toke = decoded;
//           } catch(err) {
//             console.log(err);
//             return res.json({"status": false, "message": "Token has expired, Try Again"});
//           }
          
//         next();
//     }
    
// });
app.use('/', indexRouter);
app.use('/customer', customerRouter);
app.use('/reservation', reservationRouter);
app.use('/roomInfo', roomInfoRouter);


app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
});

module.exports = app;
