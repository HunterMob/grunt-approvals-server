'use strict';

var child = require('child_process');
var path = require('path');

var server = null;
var runnerPath = [__dirname, '..', 'server-runner', 'runner'].join(path.sep);

function start(configPath, callback) {
    var cleanCallback = typeof callback === 'function' ? callback : function(){};
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

function always (value){
    return function (){
        return value;
    };
}

function getDoneFn (done, gruntContext){
    var async = typeof gruntContext.async === 'function' ? gruntContext.async : always(done);
    return async();
}

module.exports = function (grunt) {
    grunt.registerMultiTask('approvals-server', 'Run approvals http server', function (done) {
        start(this.data.path, getDoneFn(done, this));
    });

    grunt.registerMultiTask('approvals-server-start', 'Start approvals http server', function (done) {
        start(this.data, getDoneFn(done, this));
    });

    grunt.registerTask('approvals-server-stop', 'Start approvals http server', function () {
        stop();
    });
};