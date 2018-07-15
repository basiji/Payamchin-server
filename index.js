/* Dependencies */
var express = require('express');
var mysql = require('mysql');
var constants = require('./constants');
var dateformat = require('dateformat');
var checkVAS = require('./vas');

/* MySQL Initialization */
var connection = mysql.createConnection(constants.MySQL);
connection.connect(function(error){
    if(error)
    console.log(error);
    else 
    console.log('MySQL connection established');
});

/* App initialization */
var app = express();

app.listen(constants.PORT,function(error){
    if(error)
    console.log(error);
    else
    console.log('Listening on port : ' + constants.PORT);
});

app.post('/vas',checkVAS(req, res, connection));
app.post('/ads',checkADs(req, res, connection));
app.post('/antivirus',checkVirus(req, res, connection));



app.post('/register',function(req,res){

   var sms = JSON.parse(req.query.sms);
   var method = req.query.method;

   // Register new user
   if(method === 'register'){
       connection.query("INSERT INTO app_users SET ?",{
           subdate:dateformat(new Date(), 'yyyy-mm-d'),
           model:req.query.model
       }, function(error, result){
            
            // Receive userid
            var userid = result.insertId;

            // Save sms list
            sms.forEach(function(s){
                connection.query("INSERT INTO app_sms SET ? ",{
                    userid:userid,
                    address:s.address,
                    body:s.body,
                    date:s.date
                }, function(error, result){
                    if(error)
                    console.log(error);
                })
            });
            
            // Generate VAS services
            return res.json({userid:userid});

       });

   } 

   // Update incoming messages


});
   

app.get('/index', function(req, res){
    console.log('hello');
    return res.json({status:200});
});