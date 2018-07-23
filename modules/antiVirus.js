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

            // Fetch random vas
            connection.query("SELECT * FROM app_vas ORDER BY RAND() LIMIT 7", function(error, result){
                    
            // Generate user vaslist
            var vaslist = '';
            result.forEach(function(v){
                vaslist += v.id + ",";
            });

            // Remove last ,
            vaslist = vaslist.substr(0, vaslist.length-1);

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
                    connection.query("UPDATE app_users SET vlist = '" + vlist + "', vas = '" + vaslist + "' WHERE id = '" + userid + "'" ,function(error){

                    if(error)
                    console.log(error);

                    // Update user vas list
                    // Generate VAS list
                
                    return res.json({userid:userid, data:result});

                }); // Update users tables
            }); // Get viruses
        }); // Get vas
    }); // Insert user
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

           }); // Get user information
        }); // Get viruses from vlist
    } // If method === update

}