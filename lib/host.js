// host
var appHome = "/home/lloyd/app/osi-core";

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
