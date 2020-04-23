

const mysql = require('mysql');

//store the current batch status details
let detail = '';

///call when currentbatchdetails function execute 
function details(err, result, fild) {
	if(err) throw err;
	console.log(result);
	detail = result;
	return result;
	// body...
}

///connect with the database
exports.connect = ()=>{
	const con = mysql.createConnection({
	host: "localhost",
	user: "sujay_php",
	password: "Sujay@1234",
	database: "total_board"
});
	con.connect((err)=>{
		if(err) throw err;
		console.log('database connected properly');
	});
	return con;

}


////get the running batch details
exports.getcurrentbatch = (con)=>{

	const query = 'select * from batch_details where batch_status = 1';
	con.query(query, details);
	///return current batch details;
	if(detail)
	return detail;
	else
	{	console.log('here');
		con.query(query, details);
		return detail;
	}
}

///update device table;
exports.updatedevice = (con,r,u,l,d)=>{
	///r: rssi u: uptime l: line_number d: device id
	const query = 'UPDATE devices SET last_updated = current_timestamp, rssi='+r+', device_uptime='+u+' WHERE lan_id='+l+' and device_id='+d;
	con.query(query, (err, result)=>{
		if(err) throw err;
		console.log("device table update done");
	});
};


///insert data into downtime alter table
exports.dtalert = (con, data)=>{
	query = `INSERT INTO downtime_alert (machine_index,device_id,stop_reason, sc) VALUES (${data['m_id']},${data["d_id"].split('D')[1]},'','')`;
	con.query(query, (err, result)=>{
		if(err) throw err;
		console.log("downtime_alert table update done");
	});
}


///insert data into down_time table

exports.downtime = (con, dr, mid, d, et)=>{
	///dr: duration mid: machine id d: device id et: time
	query = `INSERT INTO down_time (duration,machine_index,device_id, end_time) VALUES (${dr}, ${mid},${d},'${et}')`;
	con.query(query, (err, result)=>{
		if(err) throw err;
		console.log("down_time table update done");
	});

}

///insert data into production_count table

exports.productioncount = (con, mname, count, d, bid, n)=>{
	///mname: machine index array count: machine production count array
	///d: device id bid: batch id(current) n: number of machine
	///loop through all the machine add store the data
	let flag = 0
	for(let i = 0;i<n;i++){
		
		query = `INSERT INTO production_count (machine_index, count, device_id, batch_id) VALUES (${mname[i]}, ${count[i]}, ${d}, ${bid})`;

		con.query(query, (err, result)=>{
			if(err) throw err;
			console.log("production_count table insert data done", mname[i], count[i], d, bid, n)
		});		

	}


}
