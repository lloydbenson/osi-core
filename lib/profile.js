var Boom = require('boom');
var Fs = require('fs');
var appHome = "/home/lloyd/app/osi-core";

exports.getDefaultHostProfile = function (request,reply) {
    var config = require(appHome+"/cfg/profile/host.json");
    var newConfig = {
       name: config.name, 
       memdisk: config.profile.memdisk, 
       network: config.profile.network,
       os: config.profile.os 
    };
    reply.view('profile/host.html', newConfig);
};

exports.getDefaultMemDiskProfile = function (request,reply) {
   var config = require(appHome+"/cfg/profile/memdisk.json");
   reply.view('profile/memdisk.html', config);
};

exports.getDefaultOSProfile = function (request,reply) {
   var config = require(appHome+"/cfg/profile/os.json");
   var package = "";
   config.os.package.forEach(function(entry) {
      package = package + entry + " "; 
   });
   var newConfig = {
      name: config.name, 
      os_vendor: config.os.vendor, 
      os_name: config.os.name,
      os_version: config.os.version,
      os_arch: config.os.arch,
      update_kernel: config.update.kernel,
      update_rpm: config.update.rpm,
      package: package
   };
   reply.view('profile/os.html', newConfig);
};

exports.getDefaultNetworkProfile = function (request,reply) {
   var config = require(appHome+"/cfg/profile/network.json");
   var dns = "";
   config.dns.forEach(function(entry) {
      dns = dns + entry + " "; 
   });
   var newConfig = {
      name: config.name, 
      gateway: config.gateway, 
      bootdev: config.bootdev,
      protocol: config.protocol,
      netmask: config.netmask,
      dns: dns
   };
   reply.view('profile/network.html', newConfig);
};

exports.getHostProfile = function (request,reply) {
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
};

exports.getAPIHostProfile = function(request,reply) {
   var file=appHome+"/save/profile/host/"+request.params.name+".json";
   Fs.exists(file, function(exists) {
      if (exists) {
         var json = require(file);
         reply(json);
      } else {
         reply(Boom.notFound());
      }
   });
};

exports.postHostProfile = function (request,reply) {
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
};

exports.postAPIHostProfile = function(request,reply) {
   var file=appHome+"/save/profile/host/"+request.payload.name+".json";
   Fs.writeFileSync(file,JSON.stringify(request.payload,null,3));
   reply('ok');
};
