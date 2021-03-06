var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

var headers = exports.headers;

var mimeMap = {
  '': 'text/html',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif'
};

var getContentType = function(asset) {
  var ext = path.extname(asset);
  return mimeMap[ext];
};

exports.getBody = function(req, callback) {
  var body = [];
  req.on('data', chunk => {
    body.push(chunk);
  });
  req.on('end', () => {
    body = Buffer.concat(body).toString();
    callback(body);
  });
};

exports.serveAssets = function(res, asset, statusCode, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
 
  if (asset === '/' || asset === '') { asset = 'index.html'; }
  fs.readFile(archive.paths.siteAssets + '/' + asset, function(error1, data1) {
    if (error1) {
      fs.readFile(archive.paths.archivedSites + '/' + asset, function(error2, data2) {
        if (error2) {  
          res.writeHead(404, headers);
          res.end();
          callback();
        } else {
          headers['Content-Type'] = 'text/html';
          res.writeHead(statusCode, headers);
          res.end(data2);
          callback();
        }
      });          
    } else {
      headers['Content-Type'] = getContentType(asset);
      res.writeHead(statusCode, headers);
      res.end(data1);
      callback();
    }
  });

};



// As you progress, keep thinking about what helper functions you can put here!
