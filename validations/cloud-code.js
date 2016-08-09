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
var appC = require('./api-constraints.json');
var sampleData = require('./cloud-code-data.json');

/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

function removeEmptyFields(json) {
  for (var att in json) {
    if (isEmpty(json[att])) {
      delete json[att];
    } else {
      var child = json[att];
      if (typeof(child) == 'object') {
        if (Array.isArray(child)) {
          for (var i = 0; i < child.length; i ++) {
            removeEmptyFields(child[i]);
          }
        } else {
          removeEmptyFields(child);
        }
      }
    }
  }
  return json;
}

function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  if (Array.isArray(obj)) {
    return obj.length == 0 ? true : false;
  }
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true && JSON.stringify(obj) === JSON.stringify({});
}

sampleData = removeEmptyFields(sampleData);
 console.log("??? "+ JSON.stringify(sampleData));

app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
