'use strict';

var runner = require('approvals-server-runner');

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