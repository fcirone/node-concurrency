var cluster = require('cluster');

if (cluster.isMaster) {

    var cpuCount = require('os').cpus().length;

    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });

    cluster.on('online', function(worker) {
       console.log('Worker ' + worker.process.pid + ' is online');
    });
} else {

    var express = require('express');
    var app = express();

    app.get('/', function (request, response) {
        console.log('Request to worker %d', cluster.worker.id);
        response.send('Worker ' + cluster.worker.id);
    });

    app.listen(3131);
    console.log('Worker %d running!', cluster.worker.id);
}
