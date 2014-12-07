var mongoose = require('mongoose');
var http = require('http'),
httpProxy = require('http-proxy');
var User = require("./models/User");
var Log = require("./models/Log");

mongoose.connect('mongodb://localhost/cybercamp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});
//
var server = http.createServer(function(req, res) {
  var url = req.url.replace(" ","");
  var fecha = new Date();
  var estado = "ok";

  var json = {
    "date": fecha,
    "uri": url,
    "status": estado
  };
  //	var log = JSON.parse(json);
  // Create contact


  console.log(req.url);
    if(req.url==="http://www.porno.com" || req.url==="http://www.violence.com"){
      proxy.web(req, res, { target: "127.0.0.1:5060"});
      estado = "bloked";
  }else{
    proxy.web(req, res, { target: req.url });
  }
  var newLog = new Log(json);
  newLog.save(function(err){
    if(err){
      return next(err);
    }
    User.update({username: "eslem"},{$push: { logs: newLog._id}}, function(err){
      if(err){
        return next(err);
      }

    });
  });

});

proxy.on('error', function (err, req, res) {
  /*res.writeHead(500, {
    'Content-Type': 'text/plain'
  });*/

  res.end('Something went wrong. And we are reporting a custom error message.');
});


http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('<h1>Pagina Bloqueada</h1>');
  res.end();
}).listen(5060);

server.listen(8080);
