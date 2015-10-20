var express = require('express');
var path = require('path');
var restImpl = require('./rest/restImpl_server');

var app = express();

//Lets define a port we want to listen to
var port=8080;
var ipaddress = "10.162.64.189";

//We need a function which handles requests and send response
app.use(express.static(__dirname + '/public'));
//app.use(favicon('./public/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/host/all', restImpl.all);
app.delete('/api/host/:id', restImpl.deleteById);

//Lets start our server
app.listen(port, ipaddress, function () {
    console.log('Express server listening on port: ' + port);
});