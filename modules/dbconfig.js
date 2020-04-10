

const mysql = require('mysql');


exports.connect = ()=>{
	const con = mysql.createConnection({
	host: "localhost",
	user: "sujay_php",
	password: "Sujay@1234",
	database: "total_board"
});
	return con;
}