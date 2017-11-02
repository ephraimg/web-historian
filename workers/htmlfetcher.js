// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers.js');

archive.readListOfUrls(data => {
  data.slice(0, -1).forEach(url => {
    archive.isUrlArchived(url, urlIsInArchive => {
      if (!urlIsInArchive) {
        archive.downloadUrls([url]);
      }
    });
  });
});

// cron script: 
// */1 * * * * /Users/student/.nvm/versions/node/v6.11.3/bin/node /Users/student/code/hrsf85-web-historian/workers/htmlfetcher.js