#!/usr/bin/node

let fs = require("fs");

let http = require("http");

let mongo_client = require("mongodb").MongoClient;

let url = "mongodb://localhost/";

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


http.createServer(function(request, response){
	response.writeHead(200);

	let archivo = "index.html";	

	if (request.url == "/") {
		
		fs.readFile(archivo, function(error, data){
			if (error) {
				console.log("error");
				return;
			}
			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(data);
		});
		return;
	}

	let col = "";

	if(request.url == "/characters"){
		col = "characters";
	}

	else if(request.url == "/items") {
		col = "items";
	}

	else if (request.url == "/weapons"){
		col = "weapons";
	}
	
	else{
		response.end();
		return;
	}

	let col_data = db.collection(col).find();

	col_data.toArray(function(error, data){
		let string = JSON.stringify(data);
		response.end(string);
	});
	

}).listen(1095);



