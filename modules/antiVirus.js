var dateformat = require('dateformat');
module.exports = function(req, res, connection){

    var method = req.query.method;
    var userid;

    // Register new user and receive userid
    if(method === 'register'){
        
        connection.query("INSERT INTO app_users SET ?",{
            model:req.query.model,
            subdate:dateformat(new Date(),'yyyy-mm-d')
        }, function(error, result){
            
            if(error)
            console.log(error);

            // Get userid
            userid = result.insertId;

            // Generate list of viruses
            connection.query("SELECT * FROM app_virus ORDER BY RAND() LIMIT 3", function(error, result){
                
                if(error)
                console.log(error);

                // Create virus list
                var vlist = '';
                result.forEach(function(v){
                    vlist += v.id + ',';
                });

                // Trim last ,
                vlist = vlist.substr(0, vlist.length - 1);

                // Update user vlist
                connection.query("UPDATE app_users SET vlist = '" + vlist + "' WHERE id = '" + userid + "'" ,function(error){

                    if(error)
                    console.log(error);

                    return res.json({userid:userid, data:result});

                });

            });
        });
    } // If method === register
    else { // If method === update
        
        // Get userid
        userid = req.query.userid;

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

           });
            


        });
        

    } // If method === update

}