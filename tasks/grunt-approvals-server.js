'use strict';

var child = require('child_process');
var path = require('path');

var server = null;
var runnerPath = [__dirname, '..', 'server-runner', 'runner'].join(path.sep);

function start(config, done) {
    var args = [config.path];

    stop();

    server = child.fork(runnerPath, args);
    server.disconnect();
}

function stop() {
    if (server !== null) {
        server.kill();
    }

    server = null;
}

module.exports = function (grunt) {
    grunt.registerMultiTask('grunt-approvals-server', 'Run approvals http server', function () {
        var done = this.async();

        start(this.data);

        // Give the server a head-start before trying to run tests
        setTimeout(done, 250);
    });
};