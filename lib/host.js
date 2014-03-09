// host
var Boom = require('boom');
var Fs = require('fs');
var appHome = "/home/lloyd/app/osi-core";

exports.getDefaultHost = function (request,reply) {
   var config = require(appHome+"/cfg/host.json");
   reply.view('host.html', config);
};

exports.postHost = function (request,reply) {
   var file=appHome+"/save/host/"+request.payload.host+"."+request.payload.domain+".json";
   Fs.writeFileSync(file,JSON.stringify(request.payload,null,3));
   reply().redirect('/host/'+request.payload.host+"."+request.payload.domain);
};

exports.postAPIHost = function(request,reply) {
   var file=appHome+"/save/host/"+request.payload.host+"."+request.payload.domain+".json";
   Fs.writeFileSync(file,JSON.stringify(request.payload,null,3));
   reply('ok');
};

exports.getHost = function (request,reply) {
   var file=appHome+"/save/host/"+request.params.host+".json";
   var config = {};
   Fs.exists(file, function(exists) {
      if (exists) {
         delete require.cache[file];
         config = require(file);
         config.message="File loaded successfully.";
      } else {
         // use default
         config = require(appHome+"/cfg/host.json");
         config.message="File not found.";
      }
      reply.view('host.html', config);
   });
};

exports.getAPIHost = function(request,reply) {
   var file=appHome+"/save/host/"+request.params.host+".json";
   Fs.exists(file, function(exists) {
      if (exists) {
         var json = require(file);
         reply(json);
      } else {
         reply(Boom.notFound());
      }
   });
};

