var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

var headers = httpHelpers.headers;

exports.handleRequest = function (req, res) {

  // console.log('Method: ', req.method, '; URL: ', req.url);

  if (req.method === 'POST') {
    httpHelpers.getBody(req, body => {
      archive.isUrlInList(body.slice(4), urlIsInList => {
        if (!urlIsInList) { 
          archive.addUrlToList(body.slice(4), () => {
            console.log('Added url to list');
            httpHelpers.serveAssets(res, '/loading.html', 302, () => {});
          });
        } else { // url is already in the list
          // send a found response
          res.writeHead(302, headers);
          res.end();
        }
      });
    });
  }
  
  if (req.method === 'GET') {
    fs.readdir(archive.paths.siteAssets, (err, array) => {
      // slice off initial '/' before checking if file exists in directory
      if (!array.includes(req.url.slice(1)) && req.url !== '/') { 
        res.writeHead(404, headers);
        res.end();
      } else { httpHelpers.serveAssets(res, req.url, 200, () => {}); }
    });
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end('Allowed methods: POST, GET');
  }

};

