/** 
	app.js
	@author: @rishabhio
	@description: Implementing Simple Music Server using Express JS 
	
**/

// import the modules required in our program
var express = require('express');
var fs = require('fs');

// initialize an express app
var app = express();

// declare public directory to be used as a store for static files
app.use('/public', express.static(__dirname + '/public'));


// make the default route to serve our static file 
app.get('/',function(req,res){
	
	return res.redirect('/public/home.html');

});

// start app on port 3003 and log the message to console

app.listen(8991,function(){
	console.log('App listening on port 8991!');
});

// define a route music it creates readstream to the requested file and pipes the output to response

app.get('/music', function(req,res){
	
	var fileId = req.query.id; 
	var file = __dirname + '/music/' + fileId;
	fs.exists(file,function(exists){
		if(exists)
		{
			var rstream = fs.createReadStream(file);
			rstream.pipe(res);
		}
		else
		{
			res.send("Its a 404");
			res.end();
		}
	
	});
});

// following is the code for downloading music files, note that the code remains same except that we add 2 headers viz
// Content-disposition and Content-Type which forces the chrome browser to force download rather than playing the media
// Note that the following is tested with google chrome and it may work differently in Mozilla and Opera based on your 
// installed plugins.

app.get('/download', function(req,res){
	var fileId = req.query.id;
	var file = __dirname + '/music/' + fileId;
	fs.exists(file,function(exists){
		if(exists)
		{
			res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
			res.setHeader('Content-Type', 'application/audio/mpeg3');
			var rstream = fs.createReadStream(file);
			rstream.pipe(res);
		}
		else
		{
			res.send("Its a 404");
			res.end();
		}
	});
});