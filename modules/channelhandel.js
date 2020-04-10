
const dvname = require('./getdvname');
exports.handeltopic = (topic, msg, data)=>{
	if(topic == 'Device_Status' && data["status"] == 0){


	}
	else if(topic == 'L1_PC' && data["status"] == 0){

	}
	else if(topic == 'L1_DT' && data["status"] == 1){
		data = {status: 0};
		return data
		
	}
	else if(topic == 'L1_DT_Alert' && data["status"] == 0){
		data = dvname.getfulldetails(msg);
		return data;

	}else{
		return data;
	}
}