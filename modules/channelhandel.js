
///import all the required modules
const dvname = require('./getdvname');
const db = require('./dbconfig');


//machine id list
const mId = {
	NULL:0,
	LM:1,
	FM:2,
	CM:3,
	ISM:4,
	IPM:5,
	CFM:6,
	PPM:7,
	TM:8,
	WCM:9,
	CIP:10,
	CSM:11,
	RP:12,
	SW:13,
}


exports.handeltopic = (topic, msg, data,con)=>{

	///WHEN topic is Device status
	if(topic == 'Device_Status'){

		///format the msg string
		msg = JSON.parse(`{${msg.replace(/'/g, "\"")}}`);
		let r = msg['R'];
		let u = msg['U'];
		let tmp = msg['D'].split('_');
		let l = tmp[0].split("L")[1];
		let d = tmp[1].split('D')[1];

		///update the device table
		db.updatedevice(con, r, u, l, d);
		return data;

	}

	//// when topic is production count 
	else if(topic == 'L1_PC' && data["status"] == 1){

		///current batch details query
		const query = 'select * from batch_details where batch_status = 1';

		///get the current batch details
		con.query(query, function(err, result) {
			if(err) throw err;
			const count = new Array();///to store the machine production count
			const mid = new Array();///store machine id

			///format the string
			msg = JSON.parse(`{${msg.replace(/'/g, "\"")}}`);

			//count how many key pair value present
			const kyes = Object.keys(msg);

			//get the line number
			let d = msg['D'].split('_')[1].split('D')[1];
			///object length
			let n = kyes.length;

		///store the machine wise production count
			for(let i = 0;i<n-1;i++){
				let prod = msg[kyes[i]];///get the production count
				let id = kyes[i].split('_')[1];///get the machine index
				if(id){
					count.push(prod);
					mid.push(mId[id]);}
			}
			///insert into production_count table 
			db.productioncount(con, mid, count, d, result[0]["batch_id"], mid.length);
		});

		//return the same data
		return data;

	}

	///when topic is down time it's will execute if its received a downtime altert before
	else if(topic == 'L1_DT' && data["status"] == 0){
		//format the string 
		msg = JSON.parse(`{${msg.replace(/'/g, "\"")}}`);

		//if downtime machine name match with prev downtime alert machine name
		if(msg['M'] == data["m_code"]){
			let dr = msg['DR'];///get the duration
			let mi = mId[msg['M']];///get the machine index
			let d = msg['D'].split('_')[1].split('D')[1];///get the line id

			///insert data into down_time table 
			db.downtime(con, dr, mi, d, msg['ET']);

			///clear the blokage
			return {status:1}
		}
		else
			///if prev machine is not match with dt machine
		return data;
		
	}

	////if topic is down time alert
	else if(topic == 'L1_DT_Alert' && data["status"] == 1){
		data = dvname.getfulldetails(msg); //get details about the machine 
		db.dtalert(con,data);///insert data into down_time alert table
		return data;///return the machine details data

	}

	////when it received a invalid code
	else{
		return data;
	}
}