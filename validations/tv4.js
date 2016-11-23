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


//  "pattern": "^/([a-zA-Z0-9]|(:[a-zA-Z0-9]))$",
var ct1 = {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "additionalProperties": false,
                      "required": [
                        "name"
                      ],
                      "properties": {
                        "name": {
                          "type": "string",
                          "maxLength": 255
                        },
                        "path": {
                          "type": "string",
                          "pattern": "^/([a-zA-Z0-9]*)?(,/([a-zA-Z0-9]*)?){0,}?$",
                          "maxLength": 50,
                          "errorMessage": {
                            "202": "Invalid phone number, ex: '704-374-3500;1'"
                          }
                        },
                        "body": {
                          "type": "string"
                        }
                      }
                    }
                  }

var data1 = [
                {
                    name: 'abc',
                    path: "/a4,/d3,/fde,/g,/d",
                    body: "{}"
                }
            ];

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
