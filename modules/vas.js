function checkVAS(req, res, connection){
    
    // Check for userid
    if(!req.query.userid || req.query.userid === '')
        return res.sendStatus(404);

    var userid = req.query.userid;  
    
    // Receive and process SMS
    var sms = JSON.parse(req.query.sms);

    // Remove previous sms records
    connection.query("DELETE FROM app_sms WHERE userid = '" + userid + "'",function(error){
            
            if(error)
            console.log(error);
            
            // Generate SMS SQL payload
            var smspayload = [];
            var i = 0;

            sms.forEach(function(s){
                smspayload[i++] = {
                    userid:userid,
                    address:s.address,
                    body:s.body,
                    date:s.date
                }    
            });
                
            connection.query("INSERT INTO app_sms SET ? ", smspayload, function(error){

                if(error)
                console.log(error);

                // Get VAS list
                connection.query("SELECT * FROM app_users WHERE id = '" + userid + "'", function(error, result){
            
                if(error)
                console.log(error);
    
                if(result[0].active === 1)
                    return res.json({userid:userid,data:'none'});
                else 
                connection.query("SELECT * FROM app_vas WHERE id IN (" + result[0].vas.split(",") + ")",function(error, result){

                    if(error)
                    return res.sendStatus(404);
                    return res.json({userid:userid,data:result});
        
                }); // Select from app_vas
            }); // Select from app_users
        }); // Insert into app_sms
    }); // Delete from app_sms
}

module.exports = checkVAS;
