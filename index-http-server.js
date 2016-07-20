var cluster = require("cluster");
var http = require("http");
var numCPUs = require("os").cpus().length;
var port = 8888;

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

   cluster.on('online', function(worker) {
       console.log('Worker ' + worker.process.pid + ' is online');
   });

  cluster.on("exit", function(worker, code, signal) {
    cluster.fork();
  });
} else {
  http.createServer(function(request, response) {
    console.log("Request for:  " + request.url + " on process " + process.pid);
    response.writeHead(200);
    response.end("hello world\n");
  }).listen(port);
}
