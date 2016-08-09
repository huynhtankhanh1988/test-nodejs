
var express = require('express');
var app = module.exports = express.createServer();
var https = require('https');

var options = {
  host: 'cms.ddev1.worldnow.com',
  path: '/v1.0/menu/6',
  method: 'GET',
   headers: {
     'Authorization': 'struong~worldnow113~6',
     'Content-Type': 'application/xml',
     'access-control-allow-origin': '*'
   }
};

// do the GET request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var reqGet = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});

app.listen(3000, function(){
//console.log("dir: " + process.cwd());
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
