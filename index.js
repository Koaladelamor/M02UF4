#!/usr/bin/node

let fs = require("fs");

let http = require("http");

let mongo_client = require("mongodb").MongoClient;

let url = "mongodb://localhost/";

let ObjectID = require('mongodb').ObjectID;

let db;

console.log("Iniciando script mongo-http");

mongo_client.connect(url, function(error, conn){
	console.log("Dentro de MongoDB");
	console.log(error);

	if (error) {
		console.log("ERROR!");
		return;
	}

	db = conn.db("tffhd");


});

function send_data_list (db, req, res) {

	let col = "";

	if(req.url == "/characters"){
		col = "characters";
	}

	else if(req.url == "/items") {
		col = "items";
	}

	else if (req.url == "/weapons"){
		col = "weapons";
	}
	
	else{
		res.end();
		return;
	}

	let col_data = db.collection(col).find({}, { projection: { name:1 }});

	col_data.toArray(function(error, data){
		let string = JSON.stringify(data);
		res.end(string);
	});

}

http.createServer(function(req, res){
	res.writeHead(200);

	let archivo = "index.html";	

	if (req.url == "/") {
		
		fs.readFile(archivo, function(error, data){
			if (error) {
				console.log("error");
				return;
			}
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(data);
		});
		return;
	}
	


	let url = req.url.split("/");
	console.log(url);

	if(url.length == 2){
		send_data_list(db, req, res);
	}
	else {
		if(url[2].length != 24){
			res.end();
			return;
		}
		if(url[1] == "characters"){
			console.log(url[2]);
			let objID = new ObjectID(url[2]);
			let col_data = db.collection("characters").find({"_id" : objID});

			col_data.toArray(function(error, data){
			let string = JSON.stringify(data);
			res.end(string);
			});
	

		}
		else if(url[1] == "items"){
		console.log(url[2]);
			let objID = new ObjectID(url[2]);
			let col_data = db.collection("items").find({"_id" : objID});

			col_data.toArray(function(error, data){
			let string = JSON.stringify(data);
			res.end(string);
			});

		}
	}

	//let coll_data = db.collection(col).find();

}).listen(1095);



