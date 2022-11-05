var express = require("express");
var app = new express();
const socketcli = require("socket.io-client");
var cliport = process.env.CLI_PORT || 8080;
var wsport = process.env.WS_PORT || 8081;
var videodevice = process.env.VIDEO_DEVICE || "video6";
var connectorsvc= process.env.CONNECTOR_SVC || "localhost";
const ioclient = new socketcli.connect("http://" + connectorsvc+ ":" + cliport, {
  reconnection: true,
  reconnectionDelay: 500
});
var http = require("http").createServer(app);
http.listen(wsport, function(){
    console.log('Servidor escuchando en: %s', wsport)
    });
const { spawn } = require('node:child_process');
app.post('/mystream', function(req, res){
    res.connection.setTimeout(0);
    console.log( "Stream Connected: " +req.socket.remoteAddress + ":" +req.socket.remotePort );
    req.on("data",function(data){
        ioclient.emit("video", data);
    });
    req.on("end",function(data){
        console.log("local stream has ended");
        console.log("reason: " + data);
    });
});

// set timeout
var timeout = setTimeout(function(){
    var ffmpeg = spawn('ffmpeg', [
        '-f', 'video4linux2',
        '-framerate', '30',
        '-video_size', '1280x720',
        '-i', '/dev/' + videodevice,
        '-f', 'mpegts',
        '-codec:v', 'mpeg1video',
        '-s', '1280x720',
        '-b:v', '800k',
        '-bf', '0',
        'http://localhost:' + wsport + '/mystream'
    ]);
    ffmpeg.stdout.on('data', function(data) {
    });

    ffmpeg.stderr.on('data', function(data) {
    });

    ffmpeg.on('exit', function(code) {
        console.log('child process exited with code ' + code);
        process.exit(2);
    });
}, 1000);