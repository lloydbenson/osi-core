// home
var appHome = "/home/lloyd/app/osi-core";

exports.getDashboard = function (request,reply) {
   var config = require(appHome+"/cfg/dashboard.json");
   reply.view('dashboard.html', config);
};
