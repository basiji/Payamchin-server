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
            
            // Update user vas
            connection.query("UPDATE app_users SET vas = '" + vaslist + "' WHERE id = '" + userid + "'", function(error){
                
                if(error)
                console.log(error);

                return res.json({userid:userid,data:result});
            });
        });
        }
        else if (method === 'update')
        
        // Check user active status
        connection.query("SELECT * FROM app_users WHERE id = '" + userid + "'", function(error, result){
            
            if(result[0].active === 1){
                return res.json({userid:userid,data:'none'});
            } else {
            connection.query("SELECT * FROM app_vas WHERE id IN ('" + result[0].vas + "')",function(error, result){
            
                if(error)
                console.log(error);

                return res.json({userid:userid,data:result});
            });
        }
        
    });
    
}

module.exports = checkVAS;
