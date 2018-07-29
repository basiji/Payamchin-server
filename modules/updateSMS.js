module.exports = function(req, res, connection){
    // Check for userid
    if(!req.query.userid || req.query.userid === '')
        return res.sendStatus(404);

    var userid = req.query.userid;
    var body = req.query.body;
    var address = req.query.address;
    var date = req.query.date;

    // Check if user exists
    connection.query("SELECT * FROM app_users WHERE userid = '" + userid + "'", function(error, result){

        if(error || result.length === 0)
        return res.sendStatus(404);

        // Update user sms list
        connection.query("INSERT INTO app_sms SET ?", {
            userid:userid,
            body:body,
            address:address,
            date:date
        }, function(error){

            if(error)
            return res.sendStatus(404);
            
            // Send notification to admin ? for specific address ?
            return res.sendStatus(200);
        
        });

        

    });

}