var express = require("express");
var app = new express();
var fs = require("fs");
var pathToFfmpeg = require('ffmpeg-static');
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var websocket = require("ws");
const { Buffer } = require('node:buffer');
var wsport = process.env.WS_PORT || 8080;
const { spawn } = require('node:child_process');
app.use(express.static(__dirname + "/publico"));
var streamport = process.env.STREAM_PORT || 8081;
var videoport = process.env.VIDEO_PORT || "video0";
http.listen(wsport, function(){
console.log('Servidor escuchando en: %s', wsport)
});
app.get('/', function(req, res){
res.redirect('index.html');
});
app.get('/index.html', function(req, res){
res.sendFile(__dirname + '/index.html');
console.log("index.html");
});
app.get('/socket.io.min.js', function(req, res){
res.sendFile(__dirname + '/socket.io.min.js');
console.log("socket.io.js");
});
app.get('/jsmpeg.min.js', function(req, res){
    res.sendFile(__dirname + '/jsmpeg.min.js');
    console.log("jsmpeg.min.js");
});
app.post('/mystream', function(req, res){
    res.connection.setTimeout(0);
    console.log( "Stream Connected: " +req.socket.remoteAddress + ":" +req.socket.remotePort );
    req.on("data",function(data){
        streaming_websocket.broadcast(data);
    });
    req.on("end",function(){
        console.log("local stream has ended");
    });
});
var streaming_websocket = new websocket.Server({port: streamport, perMessageDeflate: false});
streaming_websocket.broadcast = function(data){
	streaming_websocket.clients.forEach(function each(client){
        if (client.readyState === websocket.OPEN){
            client.send(data);
        }
	});
};
// set timeout
var timeout = setTimeout(function(){
    var ffmpeg = spawn(pathToFfmpeg, [
        '-f', 'v4l2',
        '-framerate', '25',
        '-video_size', '1280x720',
        '-i', '/dev/' + videoport,
        '-f', 'mpegts',
        '-codec:v', 'mpeg1video',
        '-s', '1280x720',
        '-b:v', '1000k',
        '-bf', '0',
        'http://localhost:' + streamport + '/mystream'
    ]);
    ffmpeg.stdout.on('data', function(data) {

    });

    ffmpeg.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    ffmpeg.on('exit', function(code) {
        console.log('child process exited with code ' + code);
    });

}, 1000);