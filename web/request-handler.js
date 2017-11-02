var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');

var headers = httpHelpers.headers;

exports.handleRequest = function (req, res) {
  if (req.method === 'POST') {
    httpHelpers.getBody(req, body => {
      var postUrl = body.slice(4);
      archive.isUrlInList(postUrl, urlIsInList => {
        if (!urlIsInList) { 
          archive.addUrlToList(postUrl, () => {
            httpHelpers.serveAssets(res, 'loading.html', 302, () => {});
          });
        } else { // url is already in the list; send a found response
          archive.isUrlArchived(postUrl, urlIsArchived => {
            if (urlIsArchived) {
              httpHelpers.serveAssets(res, postUrl, 302, () => {});
            } else {
              httpHelpers.serveAssets(res, 'loading.html', 302, () => {});
            }
          });
        }
      });
    });
  }
  if (req.method === 'GET') {
    httpHelpers.serveAssets(res, req.url, 200, () => {});
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end('Allowed methods: POST, GET');
  }
};

