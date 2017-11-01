var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

var headers = httpHelpers.headers;

exports.handleRequest = function (req, res) {

// res, asset, statusCode, callback


  // if (req.url === '/') {
  httpHelpers.serveAssets(res, req.url, 200, function() {
    console.log('file sent: ', req.url);
  });
  // }




};

// headers['Content-Type'] = 'text/html';
