// home
var appHome = "/home/lloyd/app/osi-core";

exports.getHome = function (request,reply) {
   var config = require(appHome+"/cfg/home.json");
   reply.view('home.html', config);
};
