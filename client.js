const mqtt = require('./modules/mqttconfig');
const express = require('express');
const db = require('./modules/dbconfig');
const channel = require('./modules/channelhandel');


///store the dt alert
let data = {status: 0};

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
	console.log(topic, ": ", msg.toString());
	data = channel.handeltopic(topic, msg.toString(), data);
	console.log(data);

});///message listener


///do the route

app.get('/api/dtalert', (req, res)=>{
	res.json(data);
});


///run the server
app.listen(port, () => {
 console.log("Server running on port 3000");
});