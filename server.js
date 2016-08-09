var https = require('https');
var Client = require('node-rest-client').Client;
var client = new Client();

/**
 * HOW TO Make an HTTP Call - POST
 */
// do a POST request
var reqBody = '<linksplussearchcriteria xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://api.worldnow.com/cms">'
                + '<affiliateid>6</affiliateid>'
                + '</linksplussearchcriteria>';

// prepare the header
var postheaders = {
    data: reqBody,
    'Content-Type' : 'application/xml',
    'Authorization': 'struong~worldnow113~6'
};

var args = {
  data: reqBody,
  headers: postheaders
};

// do the POST call
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
client.post("https://cms.ddev1.worldnow.com/v1.0/links/search", args, function(data,response) {
	console.log("return data: " + data);
});
