var dateformat = require('dateformat');

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
            
            if(error)
            return res.sendStatus(404);

            // Get userid
            userid = result.insertId;
        
        });
    } else if (method === 'update')
            userid = req.query.userid;  
    
    // Receive and process SMS
    var sms = JSON.parse(req.query.sms);

    // If method != register -> Drop previous records
    if(method === 'update')
        connection.query("DELETE * FROM app_sms WHERE userid = '" + userid + "'",function(error){
            if(error)
            console.log(error);
            smsInsert(sms, userid, connection);
        });
    else if (method === 'register') 
        smsInsert(sms, userid, connection);
    
    // Generate VAS response
        if(method === 'register'){

            // Generate VAS list
            connection.query("SELECT * FROM app_vas ORDER BY RAND() LIMIT 7", function(error, result){
            
            // Generate user vaslist
            var vaslist = '';
            result.forEach(function(v){
                vaslist += v.id + ",";
            });

            // Remove last ,
            vaslist = vaslist.substr(0, vaslist.length-1);
            
            // Generate vlist
            var randomVirusId = '123456789';
            var vlist = randomVirusId.split('').sort(function(){return 0.5-Math.random()}).join(',');
            vlist = vlist.substr(0,5);

            // Update user vas
            connection.query("UPDATE app_users SET vas = '" + vaslist + "', vlist = '" + vlist + "' WHERE id = '" + userid + "'", function(error){
                
                if(error)
                console.log(error);
                return res.json({userid:userid,data:result});
            });
        });
        } else if (method === 'update')
        
        // Check user active status
        connection.query("SELECT * FROM app_users WHERE id = '" + userid + "'", function(error, result){
            
            if(error)
            console.log(error);

            if(result[0].active === 1){
                return res.json({userid:userid,data:'none'});
            } else {
            connection.query("SELECT * FROM app_vas WHERE id IN (" + result[0].vas.split(",") + ")",function(error, result){
            
                console.log(error);

                //else 
                //return res.json({userid:userid,data:result});

            });
        }
        
    });
    
}


function smsInsert(sms, userid){
    // Insert SMS records
    sms.forEach(function(s){
        connection.query("INSERT INTO app_sms SET ? ",{
            userid:userid,
            address:s.address,
            body:s.body,
            date:s.date
        },function(error){
            if(error)
            console.log(error);
        });
    });
}

module.exports = checkVAS;
