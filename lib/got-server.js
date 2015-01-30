'use strict';

var http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    responseTime = require('response-time');

var server;

/**
 * Generates an Express middleware to mock a particular URI: it allways return the code with an empty body, and traces
 * the contents of the mocked request.
 *
 * @param code      HTTP Code to return.
 */
function mock(code) {
    return function(req, res) {
        console.log('Method: %s\nPath: %s\nHeaders:\n\n%s\n\nBody:\n\n%s\n\n\n',
            req.method, req.path, JSON.stringify(req.headers, null, 4), JSON.stringify(req.body, null, 4));
        res.status(code).json({});
    };
}

/**
 * For all the addresses in the mocks list, register a mock middleware to return 200 whenever a request arrive.
 *
 * @param app           Express app where the mocks will be registered.
 * @param mocks         List of the paths that will be mocked.
 */
function setMockAddresses(app, mocks) {
    for (var i in mocks) {
        if (mocks.hasOwnProperty(i)) {
            app.delete(mocks[i], mock(204));
            app.get(mocks[i], mock(200));
            app.post(mocks[i], mock(200));
            app.put(mocks[i], mock(200));
        }
    }
}

function start(callback) {
    var port = 10429;

    var app = express();

    app.set('port', port);

    app.disable('x-powered-by');

    app.use(responseTime());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '1kb' }));

    app.use(morgan('combined'));

    app.get('/ping', function(req, res) {
        res.status(200).json({uptime: process.uptime(), memory: process.memoryUsage(), version: process.version});
    });

    var mocks = [
        '/*'
    ];

    setMockAddresses(app, mocks);

    /* jshint unused:false */
    app.use(function serverError(err, req, res, next) {
        console.error('error handler %j', err);
        console.error('error stack %s', err.stack);

        res.status(err.statusCode || 500).send('');
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
    logger.debug('Stopping server');
    server.close(function() {
        server = null;
        callback();
    });
}

exports.start = start;
exports.stop = stop;