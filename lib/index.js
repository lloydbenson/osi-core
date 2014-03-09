var Hapi = require('hapi');
var Joi = require('joi');

var Admin = require('./admin');
var Home = require('./home');
var Host = require('./host');
var Profile = require('./profile');

var appHome = "/home/lloyd/app/osi-core";

var server = Hapi.createServer('localhost',8080, { cors: true });

server.views({ path: 'content/templates', engines: { html: 'handlebars' } });

server.route({ method: 'GET', path: '/', config: { handler: Home.getHome }});
server.route({ method: 'GET', path: '/host', config: { handler: Host.getDefaultHost }});
server.route({ method: 'GET', path: '/host/{host}', config: { handler: Host.getHost }});
server.route({ method: 'GET', path: '/api/host/{host}', config: { handler: Host.getAPIHost }});
server.route({ method: 'GET', path: '/admin/config', config: { handler: Admin.getConfig }});
server.route({ method: 'GET', path: '/profile/host', config: { handler: Profile.getDefaultHostProfile }});
server.route({ method: 'GET', path: '/profile/memdisk', config: { handler: Profile.getDefaultMemDiskProfile }});
server.route({ method: 'GET', path: '/profile/os', config: { handler: Profile.getDefaultOSProfile }});
server.route({ method: 'GET', path: '/profile/host/{name}', config: { handler: Profile.getHostProfile }});
server.route({ method: 'GET', path: '/api/profile/host/{name}', config: { handler: Profile.getAPIHostProfile }});

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
      handler: Host.postHost
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
      handler: Host.postAPIHost
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
      handler: Profile.postHostProfile
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
      handler: Profile.postAPIHostProfile
   }
});

server.start();
console.log('Starting OSI Core');
console.log(Hapi.utils.version());
//console.log(server.table());
