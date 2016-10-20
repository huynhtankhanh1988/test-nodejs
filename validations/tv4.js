/**
 * Module dependencies.
 */

var express = require('express');
var https = require('https');
//var request = require('request');
var fs = require("fs");
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var app = module.exports = express();
var tv4 = require('tv4');
var appC = require('./api-constraints.json');

/**
  Set custom message
*/
tv4.setErrorReporter(function (error, data, schema) {
  if(schema.errorMessage && schema.errorMessage[error.code]){
      return schema.errorMessage[error.code];
  }
  return;
});



var ct1 = {
        "type": "array",
        "uniqueItems": true,
        "items": {
            "type": "string",
            "pattern": "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$",
            "errorMessage": {
                "202": "Please input a valid host name.",
                "402": "hostnames is not unique."
            }
        }
}

var data1 = ["WWW.GOOGLE.COM", "google.com"];

var result1 = tv4.validateMultiple(data1, ct1);
console.log(result1.errors);


/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.end("Hello!");
});

app.get("/check", function(req, res){
    var result1 = tv4.validateMultiple(data1, ct1);
    console.log(JSON.stringify(result1.errors));
    res.end(JSON.stringify(result1));
});

app.listen(5000, function() {
  console.log("Express server listening on port 5000");
});
