var http = require('http'),
httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});
var contains = ["porn", "sex", "violence"];
//
var server = http.createServer(function(req, res) {
  console.log(req.url);
  var access = true;
  for	(index = 0; index < contains.length; index++) {
    if(req.url.indexOf(contains[index]) !==-1){
      proxy.web(req, res, { target: "127.0.0.1:5060"});
    }
  }
  if(access){
    proxy.web(req, res, { target: req.url });
  }


});

proxy.on('error', function (err, req, res) {
  /*res.writeHead(500, {
    'Content-Type': 'text/plain'
  });*/

  res.end('Something went wrong. And we are reporting a custom error message.');
});


http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(5060);

server.listen(5656);
