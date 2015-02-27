'use strict';

var http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    responseTime = require('response-time'),
    gameRoutes = require('./routes/game-routes'),
    orderRoutes = require('./routes/order-routes');

var server;

/**
 * Trace requests. For debugging purposes.
 *
 * @param code      HTTP Code to return.
 */
function tracer(req, res, next) {
    console.log('Method: %s\nPath: %s\nHeaders:\n\n%s\n\nBody:\n\n%s\n\n',
        req.method,
        req.path,
        JSON.stringify(req.headers, null, 4),
        JSON.stringify(req.body, null, 4)
    );
    next();
}

function start(traceRequests, callback) {
    if (typeof(traceRequests) === 'function') {
        callback = traceRequests;
        traceRequests = false;
    }

    var port = 10429;

    var app = express();

    app.set('port', port);

    app.disable('x-powered-by');

    app.use(responseTime());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '1kb' }));

    if (traceRequests) {
        app.use(morgan('combined'));
        app.use(tracer);
    }

    gameRoutes.registerRoutes(app);
    orderRoutes.registerRoutes(app);

    app.get('/ping', function(req, res) {
        res.status(200).json({uptime: process.uptime(), memory: process.memoryUsage(), version: process.version});
    });

    /* jshint unused:false, maxparams:4 */
    app.use(function serverError(err, req, res, next) {
        console.error('error %j', err);
        console.error('stack %s', err.stack);

        res.status(err.statusCode || 500).send(err.message || '');
    });
    /* jshint unused:true */

    if (server) {
        console.log('cs-proxy server already listening on port %s', app.get('port'));
    } else {
        server = http.createServer(app);
        server.listen(app.get('port'), function onstart() {
            console.log('cs-proxy server listening on port %s', app.get('port'));
        });
    }

    callback();
}

function stop(callback) {
    console.log('Stopping server');
    server.close(function() {
        server = null;
        callback();
    });
}

exports.start = start;
exports.stop = stop;
