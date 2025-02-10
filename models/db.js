var mysql=require('mysql');

var pool=mysql.createPool({
	host	: process.env.DB_URL,
	user	:  process.env.DB_USER,
    password : process.env.DB_SECURE_KEY,
	database	: process.env.DB_SCHEMA

});

var getConnection = function (cb) {
    pool.getConnection(function (err, connection) {
        console.log("DB URL ",process.env.DB_URL);
        if(err) {
            console.log(err);
          return cb(err);
        }
    });
};

module.exports=getConnection;
