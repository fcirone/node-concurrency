var express = require('express');
var cluster = require('cluster');
var os = require('os');//no need to download anything

var PORT = process.env.PORT || 8001;

if(cluster.isMaster) {
   var numWorkers = os.cpus().length;
   console.log('Master cluster setting up ' + numWorkers + ' workers...');

   for(var i = 0; i < numWorkers; i++) {
       cluster.fork();
   }

   cluster.on('online', function(worker) {
       console.log('Worker ' + worker.process.pid + ' is online');
   });

   cluster.on('exit', function(worker, code, signal) {
       console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
       console.log('Starting a new worker');
       cluster.fork();
   });
} else {
   var app = require('express')();

   app.listen(PORT, function() {
      console.log('Express server listening on %d, in %s mode', PORT, app.get('env'));
   });

   // // Start server
   // server.listen(config.port, config.ip, function () {
   //   console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
   // });
}
