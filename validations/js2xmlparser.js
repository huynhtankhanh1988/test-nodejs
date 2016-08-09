/**
 * Module dependencies.
 */

var express = require('express');
var https = require('https');
var request = require('request');
var fs = require("fs");
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var app = module.exports = express();
var tv4 = require('tv4');
var js2xmlparser = require("js2xmlparser");

var data = {
    "@": {
        "fullname": "dsfds"
    },
    "firstName": "John",
    "lastName": "Smith"
};

var options = {
    callFunctions: true,
    useCDATA: true
};


console.log(js2xmlparser("person", data, options));

/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
