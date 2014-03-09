var Boom = require('boom');
var Fs = require('fs');
var Hapi = require('hapi');
var Joi = require('joi');

//var Host = require('../host');

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
        var config = require('../cfg/home.json');
        reply.view('home.html', config);
      }
   }
});

server.route({
   method: 'GET',
   path: '/host',
   config: {
      handler: function (request,reply) {
        var config = require(appHome+"/cfg/host.json");
        reply.view('host.html', config);
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
         var file=appHome+"/save/host/"+request.payload.host+"."+request.payload.domain+".json";
         Fs.writeFileSync(file,JSON.stringify(request.payload,null,3));
         reply().redirect('/host/'+request.payload.host+"."+request.payload.domain);
      }
   }
});


server.route({
   method: 'GET',
   path: '/host/{host}',
   config: {
      handler: function (request,reply) {
         var file=appHome+"/save/host/"+request.params.host+".json";
         var config = {};
         Fs.exists(file, function(exists) {
            if (exists) {
               delete require.cache[file];
               config = require(file);
               config.message="File loaded successfully."
            } else {
               // use default
               config = require(appHome+"/cfg/host.json");
               config.message="File not found.";
            }
            reply.view('host.html', config);
         });
      }
   }
});


server.route({
   method: 'GET',
   path: '/api/host/{host}',
   config: {
      handler: function(request,reply) {
         var file=appHome+"/save/host/"+request.params.host+".json";
         Fs.exists(file, function(exists) {
            if (exists) {
               var json = require(file);
               reply(json);
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
         var file=appHome+"/save/host/"+request.payload.host+"."+request.payload.domain+".json";
         Fs.writeFileSync(file,JSON.stringify(request.payload,null,3));
         reply('ok');
      }
   }
});

server.route({
   method: 'GET',
   path: '/profile/host',
   config: {
      handler: function (request,reply) {
        var config = require(appHome+"/cfg/profile/host.json");
        var newConfig = {
           name: config.name, 
           memdisk: config.profile.memdisk, 
           network: config.profile.network,
           os: config.profile.os 
        };
        reply.view('profile/host.html', newConfig);
      }
   }
});

server.route({
   method: 'GET',
   path: '/profile/host/{name}',
   config: {
      handler: function (request,reply) {
         var file=appHome+"/save/profile/host/"+request.params.name+".json";
         var config = {};
         Fs.exists(file, function(exists) {
            if (exists) {
               delete require.cache[file];
               var orig = require(file);
               config = {
                  name: orig.name, 
                  memdisk: orig.profile.memdisk, 
                  network: orig.profile.network,
                  os: orig.profile.os 
               };
               config.message="File loaded successfully."
            } else {
               // use default
               config = require(appHome+"/cfg/profile/host.json");
               config.message="File not found.";
            }
            reply.view('profile/host.html', config);
         });
      }
   }
});

server.route({
   method: 'GET',
   path: '/api/profile/host/{name}',
   config: {
      handler: function(request,reply) {
         var file=appHome+"/save/profile/host/"+request.params.name+".json";
         Fs.exists(file, function(exists) {
            if (exists) {
               var json = require(file);
               reply(json);
            } else {
               reply(Boom.notFound());
            }
         });
      }
   }
});

server.route({
   method: 'POST',
   path: '/profile/host',
   config: {
      validate: {
         payload: {
            name: Joi.string().required(),
            memdisk: Joi.string().required(),
            network: Joi.string().required(),
            os: Joi.string().required()
         }
      },
      handler: function (request,reply) {
         var payload = {
            name: request.payload.name,
            profile: {
               memdisk: request.payload.memdisk,
               network: request.payload.network,
               os: request.payload.os
            }
         };
         var file=appHome+"/save/profile/host/"+payload.name+".json";
         Fs.writeFileSync(file,JSON.stringify(payload,null,3));
         reply().redirect('/profile/host/'+payload.name);
      }
   }
});

server.route({
   method: 'POST',
   path: '/api/profile/host',
   config: {
      validate: {
         payload: {
            name: Joi.string().required(),
            profile: Joi.object({
               memdisk: Joi.string().required(),
               network: Joi.string().required(),
               os: Joi.string().required()
            }).required()
         }
      },
      handler: function(request,reply) {
         var file=appHome+"/save/profile/host/"+request.payload.name+".json";
         Fs.writeFileSync(file,JSON.stringify(request.payload,null,3));
         reply('ok');
      }
   }
});

server.route({
   method: 'POST',
   path: '/api/profile/os',
   config: {
      validate: {
         payload: {
            name: Joi.string().required(),
            profile: Joi.object({
               memdisk: Joi.string().required(),
               network: Joi.string().required(),
               os: Joi.string().required()
            }).required()
         }
      },
      handler: function(request,reply) {
         var file=appHome+"/save/profile/os/"+request.payload.name+".json";
         Fs.writeFileSync(file,JSON.stringify(request.payload,null,3));
         reply('ok');
      }
   }
});

server.route({
   method: 'GET',
   path: '/admin/config',
   config: {
      handler: function (request,reply) {
         var config = require('../cfg/admin/config.json');
         reply.view('admin/config.html', config);
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
