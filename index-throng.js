/* jshint node: true */
'use strict';

const throng = require('throng');

var WORKERS = process.env.WEB_CONCURRENCY || 1;
var PORT = process.env.PORT || 3131;

// throng({
//   workers: WORKERS,
//   lifetime: Infinity,
//   start: startApp
// });

throng(startApp);

function startApp() {
  var express = require('express');
  var crypto = require('crypto');
  var app = express();

  app.get('/', function (request, response) {
      console.log('Request to worker %d', cluster.worker.id);
      response.send('Worker ' + cluster.worker.id);
  });

  app.listen(PORT, onListen);
  app.get('/cpu', cpuBound);
  app.get('/memory', memoryBound)
  app.get('/io', ioBound)

  function cpuBound(req, res, next) {
    var key = Math.random() < 0.5 ? 'ninjaturtles' : 'powerrangers';
    var hmac = crypto.createHmac('sha512WithRSAEncryption', key);
    var date = Date.now() + '';
    hmac.setEncoding('base64');
    hmac.end(date, function() {
      res.send('A hashed date for you! ' + hmac.read());
    });
  }

  function memoryBound(req, res, next) {
    var hundredk = new Array(100 * 1024).join('X');

    console.log('PID %d', process.pid);

    setTimeout(function sendResponse() {
      res.send('Large response: ' + hundredk);
    }, 2000).unref();
  }

  function ioBound(req, res, next) {
    setTimeout(function SimulateDb() {
      res.send('Got response from fake db!');
    }, 300).unref();
  }

  function onListen() {
    console.log('Listening on', PORT);
  }
}
