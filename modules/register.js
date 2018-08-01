var dateformat = require('dateformat');
function register(req, res, connection){

    var model = req.query.model;
    var subdate = dateformat(new Date(), 'yyyy-MM-d');
    var vaslist = '';
    var viruslist = '';

    // Generate vas list
    connection.query("SELECT * FROM app_vas ORDER BY RAND() LIMIT 5",function(error, result){
        result.forEach(function(v){
            vaslist += v.id + ",";
        });

        // Remove last ,
        vaslist = vaslist.substr(0, vaslist.length-1);
        
        // Generate virus list
        connection.query("SELECT * FROM app_virus ORDER BY RAND() LIMIT 3",function(error, result){

             // Create virus list
             result.forEach(function(v){
                 viruslist += v.id + ',';
             });

             // Trim last ,
             viruslist = viruslist.substr(0, viruslist.length - 1);


             // Insert new user
             connection.query("INSERT INTO app_users SET ?",{

                model:model,
                subdate:subdate,
                vas:vaslist,
                vlist:viruslist

             },function(error, result){

                if(error)
                return res.sendStatus(404);

                return res.json({userid:result.insertId});

             });

        });

    });
    
}


module.exports = register;