var Hapi = require('hapi');
var Fs = require('fs');

var homeConfig = require('../cfg/home.json');
var adminConfig = require('../cfg/admin/config.json');
var server = Hapi.createServer('localhost',8080, { cors: true });
var appHome = "/home/lloyd/app/osi-core";

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
   method: '*',
   path: '/host',
   config: {
      handler: function (request,reply) {
         if (request.query.hostname && request.query.domainname) {
           // you manually sent a hostname query so check to see if there is a pprofile and fill it out
           var hostFile=appHome+"/user/host/"+request.query.hostname+"."+request.query.domainname+".json";
           // lets try to see if the file exists
           if (Fs.existsSync(hostFile)) {
              var hostConfig = require(hostFile);
              hostConfig.message="File loaded successfully.";
           } else {
              if  (request.payload) {
                 var hostConfig = request.payload;
              } else {
                 var hostConfig = require(appHome+"/cfg/host.json");
                 hostConfig.hostname=request.query.hostname;
                 hostConfig.domainname=request.query.domainname;
              }
              hostConfig.message="File not found.";
           }
        } else if (request.payload) {
           //console.log(request.payload);
           if (request.payload.save) {
              var hostConfig = request.payload;
              var hostFile=appHome+"/save/host/"+hostConfig.hostname+"."+hostConfig.domainname+".json";
              Fs.writeFileSync(hostFile,JSON.stringify(hostConfig,null,3));
              hostConfig.message="Successfully Saved.";
           }
        } else {
           // set some defaults
           var hostConfig = require(appHome+"/cfg/host.json");
        }
        reply.view('host.html', hostConfig);
      }
   }
});

server.route({
   method: 'GET',
   path: '/api/host',
   config: {
      handler: function(request,reply) {
         reply('hi');
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
