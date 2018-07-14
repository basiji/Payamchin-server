/* Dependencies */
var express = require('express');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var constants = require('./constants');

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
app.use('/',bodyparser);

app.listen(constants.PORT,function(error){
    if(error)
    console.log(error);
    else
    console.log('Listening on port : ' + constants.PORT);
});

app.POST('/register',function(req,res){

    res.json({status:'success'});

});