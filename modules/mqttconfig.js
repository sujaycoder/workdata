const mqtt = require('mqtt');

//broker url
const url = 'mqtt://172.105.50.239';
///broker credential
const opt = {	
	username: 'total',
	password: 'total@!@#$'
};


///connect with the broker and return the obj
exports.connect = ()=>{
	const client = mqtt.connect(url, opt);
	return client;
}


///topics list
const topics = [
'Device_Status',
'L1_PC',
'L1_DT',
'L1_DT_Alert'
];


///subscirbe all the topics with quality of service at 0
exports.subscribe = (client)=>{
	client.subscribe(topics, {qos:0}, (err, grn)=>{
		console.log("granted topics: ",grn);
		console.log('Error: '+err);
	});

};