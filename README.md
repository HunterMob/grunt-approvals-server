# Grunt Approvals Server

Grunt task to run approvals server for client-side approval testing

Grunt Approvals Server is a Grunt wrapper around approvals-server which is a node server wrapper around Javascript
approvals.  Due to the wrapper nature of the grunt task, the configuration is minimal, simply taking the file location
for your approvals-server configuration.  An example configuration is as follows:

~~~
// ... grunt code above

    grunt.initConfig({
        "approvals-server": {
            start: {
                path: '.config/approvals-server.conf.js' // replace this path with your own
            }
        },
        // other configuration goes here
    });

    grunt.loadNpmTasks('grunt-approvals-server');
    // loading more tasks

    grunt.registerTask('test', ['approvals-server:start', 'test-runner-task']);

// and grunt code below ...
~~~

The gruntfile I used to test proper installation is as follows:

~~~
module.exports = function (grunt) {
    grunt.initConfig({
        karma: {
            test: {
                configFile: '.config/karma.conf.js'
            }
        },
        "approvals-server": {
            start: {
                path: '.config/approvals-server.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-approvals-server');

    grunt.registerTask('test', ['approvals-server:start', 'karma:test']);
};
~~~

Configuration for approvals-server can be found on the [Approvals Server](https://www.npmjs.com/package/approvals-server) 
NPM page and configuration for approvals can be found on the [Approvals](https://www.npmjs.com/package/approvals) page.

An example configuration for the Approvals/Approvals-Server package looks like the following:

~~~
var BeyondCompare4 = require('beyond-compare-4-reporter');

module.exports = {
    approvals: {
        reporters: [new BeyondCompare4()],

        normalizeLineEndingsTo: '\n',

        appendEOL: true,

        EOL: require('os').EOL,

        errorOnStaleApprovedFiles: true,

        shouldIgnoreStaleApprovedFile: function (/*fileName*/) { return false; },

        stripBOM: false,

        forceApproveAll: false

    },
    port: 3217,
    path: './test/approvals'
}
~~~

An example custom reporter for Beyond Compare 4 is like the following:

~~~
var spawn = require('child_process').spawn;
var fs = require('fs');

function statPath(filePath) {
    try {
        return fs.lstatSync(filePath);
    } catch (e) {
        return false;
    }
}

function BeyondCompare4 () {
    return {
        name: 'BeyondCompare4',
        canReportOn: function () {
            return true;
        },
        report: function (approvedFilePath, receivedFilePath) {
            var executionPath = '/Program Files/Beyond Compare 4/BCompare.exe';
            var approvedPath = './' + approvedFilePath;
            var receivedPath = './' + receivedFilePath;

            var approvedStat = statPath(approvedPath);

            if (!approvedStat) {
                fs.writeFileSync(approvedPath, '');
            }

            spawn(executionPath, [receivedPath, approvedPath], { detached: true });

        }
    };
};
~~~