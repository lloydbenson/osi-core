var Boom = require('boom');
var Fs = require('fs');
var Hapi = require('hapi');
var Joi = require('joi');

var homeConfig = require('../cfg/home.json');
var adminConfig = require('../cfg/admin/config.json');
var appHome = "/home/lloyd/app/osi-core";

var server = Hapi.createServer('localhost',8080, { cors: true });

server.views({
   path: 'content/templates',
   engines: {
      html: 'handlebars'
   }
});

server.route({
   method: 'GET',
   path: '/',
   config: {
      handler: function (request,reply) {
        reply.view('home.html', homeConfig);
      }
   }
});

server.route({
   method: 'GET',
   path: '/host',
   config: {
      handler: function (request,reply) {
        var hostConfig = require(appHome+"/cfg/host.json");
        reply.view('host.html', hostConfig);
      }
   }
});

server.route({
   method: 'POST',
   path: '/host',
   config: {
      validate: {
         payload: {
            host: Joi.string().required(),
            domain: Joi.string().required(),
            profile: Joi.string().required(),
            ip: Joi.string().required(),
            macaddress: Joi.string().optional(),
            active: Joi.boolean().optional()
         }
      },
      handler: function (request,reply) {
         var hostFile=appHome+"/save/host/"+request.payload.host+"."+request.payload.domain+".json";
         Fs.writeFileSync(hostFile,JSON.stringify(request.payload,null,3));
         reply().redirect('/host/'+request.payload.host+"."+request.payload.domain);
      }
   }
});


server.route({
   method: 'GET',
   path: '/host/{host}',
   config: {
      handler: function (request,reply) {
         var hostFile=appHome+"/save/host/"+request.params.host+".json";
         var hostConfig = {};
         Fs.exists(hostFile, function(exists) {
            if (exists) {
               delete require.cache[hostFile];
               hostConfig = require(hostFile);
               hostConfig.message="File loaded successfully." + hostConfig.ip;
            } else {
               // use default
               hostConfig = require(appHome+"/cfg/host.json");
               hostConfig.message="File not found.";
            }
            reply.view('host.html', hostConfig);
         });
      }
   }
});


server.route({
   method: 'GET',
   path: '/api/host/{host}',
   config: {
      handler: function(request,reply) {
         var hostFile=appHome+"/save/host/"+request.params.host+".json";
         Fs.exists(hostFile, function(exists) {
            if (exists) {
               var hostJson = require(hostFile);
               reply(hostJson);
            } else {
               reply(Boom.notFound());
            }
         });
      }
   }
});

server.route({
   method: 'POST',
   path: '/api/host',
   config: {
      validate: {
         payload: {
            host: Joi.string().required(),
            domain: Joi.string().required(),
            profile: Joi.string().required(),
            ip: Joi.string().required(),
            macaddress: Joi.string().optional(),
            active: Joi.boolean().optional()
         }
      },
      handler: function(request,reply) {
         var hostFile=appHome+"/save/host/"+request.payload.host+"."+request.payload.domain+".json";
         Fs.writeFileSync(hostFile,JSON.stringify(request.payload,null,3));
         reply('ok');
      }
   }
});

server.route({
   method: 'GET',
   path: '/admin/config',
   config: {
      handler: function (request,reply) {
         reply.view('admin/config.html', adminConfig);
      }
   }
});

server.route({
   method: '*',
   path: '/admin/rawedit',
   config: {
      handler: function (request,reply) {
         if (request.query.filename === "some.cfg") {
           //request.query.contents = "home contents";
           request.query.contents = Fs.readFileSync("/home/lloyd/app/osi-server/node_modules/osi-core/user/"+request.query.filename);
         }
         if (request.save) {
           Fs.writeFileSync("/home/lloyd/app/osi-server/node_modules/osi-core/user/"+request.query.contents);
           request.message="Successfully Saved.";
         } else {
           request.message="Not Saved.";
         }
         //console("save value:"+request.query.save);
         reply.view('rawedit.html', request.query);
      }
   }
});

server.start();
console.log('Starting OSI Core');
console.log(Hapi.utils.version());
//console.log(server.table());
