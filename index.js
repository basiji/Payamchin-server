/* Dependencies */
var express = require('express');
var mysql = require('mysql');
var constants = require('./constants');
var dateformat = require('dateformat');


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

app.post('/register',function(req,res){

   var sms = JSON.parse(req.query.sms);
   var number = req.query.number;
   var method = req.query.method;

   // Register new user
   if(method === 'register'){
       connection.query("INSERT INTO app_users SET ?",{
           number:number,
           subdate:dateformat(new Date(), 'yyyy-mm-d'),
           model:req.query.model
       }, function(error, result){
            
            if(error)
            return res.sendStatus(404);
            
            // Receive userid
            var userid = result.insertId;

            // Save sms list
            sms.forEach(function(s){
                connection.query("INSERT INTO app_sms SET ? ",{
                    address:s.address,
                    body:s.body,
                    date:s.date
                }, function(error, result){
                    if(error)
                    console.log(error);
                })
            });
            
            return res.json({userid:userid});

       });

   }

});
   

app.get('/index', function(req, res){
    console.log('hello');
    return res.json({status:200});
});