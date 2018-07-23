module.exports = function(req, res, connection){

    // Check for userid
    if(!req.query.userid || req.query.userid === '')
        return res.sendStatus(404);

    // Get userid
    var userid = req.query.userid;

    // Get user information
    connection.query("SELECT * FROM app_users WHERE id = '" + userid + "'",function(error, result){
        
        if(error)
        console.log(error);
        
        // Check activation
        if(result[0].active === 1)
            return res.json({userid:userid, data:'none'});

        connection.query("SELECT * FROM app_virus WHERE id IN (" + result[0].vlist.split(",") + ")",function(error, result){

        if(error)
        console.log(error);

        return res.json({userid:userid, data:result});

        }); // Get user information
    }); // Get viruses from vlist
} 
