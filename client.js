
///import all the require modules from /modules folder
const mqtt = require('./modules/mqttconfig');
const express = require('express');
const db = require('./modules/dbconfig');
const channel = require('./modules/channelhandel');


///store the dt alert
let data = {status: 1};

//port number 
port = process.env.PORT || 3000

///make the express obj
app = express();

//connect with the db
const con = db.connect();

///connect with the broker
const client = mqtt.connect();

///connect listener trigger when client connected
client.on('connect', ()=>{
	console.log('connected properly');
	//subscribe the channles or topics
	if(client.connected == true){
		mqtt.subscribe(client);
	}
});

///error listenern trigger when client is raise some error
client.on('error', (err)=>{
	console.log("can not connect "+err);
});


///mqtt message listener when a subscribe topic send a msg
client.on('message', (topic, msg, packet)=>{

	//print the msg geting from the subscriber topics
	console.log(topic, ": ", msg.toString());

	///handel the topics and data and return required data to send via api
	data = channel.handeltopic(topic, msg.toString(), data, con);

});///message listener


///do the route

app.get('/api/dtalert', (req, res)=>{
	res.json(data);//send the response in json format
});


///run the server
app.listen(port, () => {
 console.log("Server running on port " + port);
});