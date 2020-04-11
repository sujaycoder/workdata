

///machine index list
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

///machine name list
const mname = {
	1:"Labelling Machine",
	2:"Filling Machine",
	3:"Capping Machine",
	4:"Induction Sealer Machine",
	5:"Inkjet Printer Machine",
	6:"Carton Forming Machine",
	7:"Pick and Place Machine",
	8:"Tapping Machine",
	9:"Weight Checker Machine",
	10:"Carton Inkjet Printer",
	11:"Carton Strapper Machine",
	12:"Robot Palletizer",
	13:"Stretch Wrapper"
}


///formatg the down time alert data to send via api
exports.getfulldetails = (dvname)=>{

	let data = JSON.parse(`{${dvname.replace(/'/g, "\"")}}`);
	let m = data['M'];
	data = data["D"].split('_');
	let d = data[1];
	let l = data[0];

	///return the json obj it will send via api
	return {
		l_id: l,
		d_id: d,
		m_id: mId[m],
		m_code: m,
		status: 0

	};

}