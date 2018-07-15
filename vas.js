function checkVAS(req, res, connection){
    
    // Check method
    var method = req.query.method;
    var userid;

    // Check userID
    if(method === 'register'){
        connection.query("INSERT INTO app_users SET ?",{

            model:req.query.model,
            subdate:dateformat(new Date(), 'yyyy-mm-d')

        },function(error, result){
            userid = result.insertId;
        })
    } else if (method === 'update')
            userid = req.query.userid;
    

    // Receive and process SMS
    var sms = JSON.parse(req.query.sms);

    // If method != register -> Drop previous records
    if(method === 'update')
        connection.query("DELETE * FROM app_sms WHERE userid = '" + userid + "'",function(error){});
    
    // Insert SMS records
    sms.forEach(function(s){
        connection.query("INSERT INTO app_sms SET ? ",{
            userid:userid,
            address:s.address,
            body:s.body,
            date:s.date
        },function(error){});
    });


    // Generate VAS response
    // Check if user is active
    var active = false;
    if(method === 'update')
        connection.query("SELECT * FROM app_users WHERE userid = '" + userid + "'",function(error, result){
            active = result[0].active;
        });
    if(!active){
        connection.query("SELECT * FROM app_vas ORDER BY RAND() LIMIT 7", function(error, result){
            return res.json({userid:userid,data:result});
        });
    } else {
        return res.json({userid:userid, data:''});
    }
    
}

module.exports = checkVAS;
