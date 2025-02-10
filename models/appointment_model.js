var getConnection=require('./db'); var mysql=require('mysql');
var jwt_simple=require('jwt-simple');
var crypto=require('crypto');
var tokens=require('.././auth/secure');
var moment=require('moment');


var bookappointment=function (data,callback) {
	var user_id=data.user_id;
	if(!user_id){
		callback({"success":false,"msg":"Invalid Request"},null);
		return;
	}
  
	var datenew=new Date(data.app_date);
	var appdate=moment(datenew).format('YYYY-MM-DD');

	console.log(appdate);
	console.log(data.app_time);
	var tt=new Date(data.app_date+" "+data.app_time);
	var ttime=moment(tt).format('H:mm:ss');
	console.log("t1 :"+tt);
	console.log("tnew :"+ttime);

  var search_appointment='Select app_id from appointment where ( user_id='+mysql.escape(user_id)+' and app_status="pending" ) || ( user_id='+mysql.escape(user_id)+' and payment_status="False")';
	var create_appointment='Insert into appointment(app_date,user_id,patient_name,patient_age,patient_gender,patient_contact,patient_email,doc_id,app_time) values('+mysql.escape(appdate)+','+mysql.escape(data.user_id)+','+mysql.escape(data.patient_name)+','+mysql.escape(data.patient_age)+','+mysql.escape(data.patient_gender)+','+mysql.escape(data.patient_contact)+','+mysql.escape(data.patient_email)+','+mysql.escape(data.doc_id)+","+mysql.escape(ttime)+');';

	var search_user='Select * from appointment where (doc_id='+mysql.escape(data.doc_id)+" and app_date="+mysql.escape(appdate)+" and app_time="+mysql.escape(app_time)+" );"

	console.log(search_appointment);

  getConnection(function(err,connection){
		console.log("get connection");
		if(err){
			//console.log(err);
			connection.release();
			//throw err;
			callback({"msg":"Connection not established!"},null);
		}
      
		else{
			connection.query(search_appointment,function(err,rowss){
				if(err){
					connection.release();
				   callback({"success":false,"msg":err},null);
				}
          
				else{
					if(rows.length>0){
						connection.release();
				       callback({"success":false,"msg":err},null);
					}
            
					else{
						connection.query(search_appointment,function(err,rows,cols){
				console.log("Search appointment");
			if(err){
				console.log("Error Searching appointment");
				connection.release();
				callback({"success":false,"msg":err},null);
			}
        
			else{
				console.log("Rows Length : "+rows.length);
				if(rows.length>1){					
							console.log("Appointment Found");
                    		connection.release();
							callback({"success":false,"msg":"Appointment already found"},null);			
				}
          
				else{
					connection.query(create_appointment,function(err,resu){
						console.log("Creating Appointment");
						if(err){
							connection.release();
							callback({"success":false,"msg":err},null);
						}
              
						else{
                            connection.release();
							var send_data={"success":true};
							callback(null,send_data);
						}
					});
				}
			}
		});
					}
				}
			});
		}
	});
}

