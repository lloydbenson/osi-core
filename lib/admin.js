var Fs = require('fs');
var appHome = "/home/lloyd/app/osi-core";

exports.getConfig = function (request,reply) {
   var config = require('../cfg/admin/config.json');
   reply.view('admin/config.html', config);
};
