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

/**
  Set custom message
*/
tv4.setErrorReporter(function (error, data, schema) {
  if(schema.errorMessage && schema.errorMessage[error.code]){
      return schema.errorMessage[error.code];
  }
  return;
});

var ct = {
           "type": "array",
           "items": {
             "anyOf": [
               {
                 "basicReadings": {
                   "type": "object",
                   "additionalProperties": false,
                   "properties": {
                     "enabled": {
                       "type": "boolean"
                     },
                     "fgColor": {
                       "type": [
                         "string",
                         "null"
                       ],
                       "pattern": "^#[A-Fa-f0-9]{6}$",
                       "errorMessage": {
                         "202": "Invalid hex color."
                       }
                     },
                     "bgColor": {
                       "type": [
                         "string",
                         "null"
                       ],
                       "pattern": "^#[A-Fa-f0-9]{6}$",
                       "errorMessage": {
                         "202": "Invalid hex color."
                       }
                     }
                   }
                 }
               },
               {
                 "detailedReadings": {
                   "type": "object",
                   "additionalProperties": false,
                   "properties": {
                     "enabled": {
                       "type": "boolean"
                     },
                     "fgColor": {
                       "type": [
                         "string",
                         "null"
                       ],
                       "pattern": "^#[A-Fa-f0-9]{6}$",
                       "errorMessage": {
                         "202": "Invalid hex color."
                       }
                     },
                     "bgColor": {
                       "type": [
                         "string",
                         "null"
                       ],
                       "pattern": "^#[A-Fa-f0-9]{6}$",
                       "errorMessage": {
                         "202": "Invalid hex color."
                       }
                     },
                     "conditions": {
                       "type": "array",
                       "items": {
                         "type": [
                           "string",
                           "null"
                         ],
                         "maxLength": 255
                       }
                     }
                   }
                 },
                   "weatherProviders": {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "wsi": {
                          "type": "object",
                          "additionalProperties": false,
                          "properties": {
                            "memberId": {
                              "type": [
                                "string",
                                "null"
                              ],
                              "maxLength": 255
                            },
                            "serviceId": {
                              "type": [
                                "string",
                                "null"
                              ],
                              "maxLength": 255
                            },
                            "mapId": {
                              "type": [
                                "string",
                                "null"
                              ],
                              "maxLength": 255
                            },
                            "sdkKey": {
                              "type": [
                                "string",
                                "null"
                              ],
                              "maxLength": 255
                            }
                          }
                        }
                      }
                    }
               }
             ]
           }
         }

var data = [
{
   "basicReadings": {
        "enabled": "ddd",
        "fgColor": "#ffffff",
        "bgColor": "#ffffff1"
   }
 },
 {
   "detailedReadings111111": {
         "enabled": true,
         "fgColor": "#ffffff",
         "bgColor": "#ffffff",
         "conditions": "a, b, c"
    },
    "weatherProviders": {
        "wsi": {
             "memberId": "memberId",
             "serviceId": "serviceId",
             "mapId": "mapId",
             "sdkKey": "sdkKey"
        }
    }
  }
];

//var result = tv4.validateMultiple(data, ct);
//console.log(result.errors);
//console.log(result.valid);


var ct1 = {
    "type": "array",
    "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "type": {
            "type": [
              "string",
              "null"
            ],
            "maxLength": 255
          },
          "fgColor": {
            "type": [
              "string",
              "null"
            ],
            "pattern": "^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$",
            "errorMessage": {
              "202": "Invalid hex color."
            }
          },
          "bgColor": {
            "type": [
              "string",
              "null"
            ],
            "pattern": "^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$",
            "errorMessage": {
              "202": "Invalid hex color."
            }
          },
          "defaultAltitude": {
            "type": [
              "string",
              "null"
            ],
            "maxLength": 20,
            "pattern": "^(-|\\+)?\\d+\\.?\\d*$",
            "errorMessage": {
              "202": "Invalid altitude."
            }
          }
        }
    },
    "uniqueItems": "/type",
    "errorMessage": {
      "402": "More then one item has the same 'type' properties."
    }
}

var data1 = [
  {
    "type":"a",
    "fgColor": "105.25",
    "bgColor": "55.225",
    "defaultAltitude": "2000000000"
  },
   {
      "type":"b",
      "fgColor": "1444445.25",
      "bgColor": "55.225",
      "defaultAltitude": "2000000000"
    }
]

var result1 = tv4.validateMultiple(data1[0], ct1);
console.log(result1.errors);
//console.log(result1.valid); //for(var i = 0; i < result.errors.length; i++) {
//  console.log("==============================error at " + i);
//  console.log("path: " + result.errors[i]['dataPath']);
//}

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
