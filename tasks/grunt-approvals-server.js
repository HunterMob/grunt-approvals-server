'use strict';

var child = require('child_process');
var path = require('path');

var server = null;
var runnerPath = [__dirname, '..', 'server-runner', 'runner'].join(path.sep);

function start(configPath, callback) {
    var args = [configPath];

    stop();

    server = child.fork(runnerPath, args);
    server.disconnect();

    setTimeout(callback, 250);
}

function stop() {
    if (server !== null) {
        server.kill();
    }

    server = null;
}

module.exports = function (grunt) {
    grunt.registerMultiTask('approvals-server', 'Run approvals http server', function (done) {
        start(this.data.path);
    });

    grunt.registerMultiTask('approvals-server-start', 'Start approvals http server', function (done) {
        start(this.data);
    });

    grunt.registerTask('approvals-server-stop', 'Start approvals http server', function () {
        stop();
    });
};