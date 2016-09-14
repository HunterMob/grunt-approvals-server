var path = require('path');

var configPath = process.cwd() + path.sep + process.argv[2];
var config = require(configPath);

require('approvals-server')(config);
