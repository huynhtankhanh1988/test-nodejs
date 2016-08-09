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

var commonSchema = {
                     "type": "object",
                     "additionalProperties": false,
                     "required": [
                       "affiliateId",
                       "affiliateName"
                     ],
                     "properties": {
                       "affiliateId": {
                         "type": "string",
                         "maxLength": 255
                       },
                       "affiliateName": {
                         "type": "string",
                         "maxLength": 255
                       },
                       "objectId": {
                         "type": "string"
                       },
                       "updatedAt": {
                         "type": [
                           "string",
                           "null"
                         ],
                         "format": "date-time"
                       },
                       "createdAt": {
                         "type": [
                           "string",
                           "null"
                         ],
                         "format": "date-time"
                       },
                       "socialTools": {
                         "type": "object",
                         "additionalProperties": false,
                         "properties": {
                           "publishing": {
                             "type": "object",
                             "additionalProperties": false,
                             "properties": {
                               "twitter": {
                                 "type": "array",
                                 "items": {
                                   "type": "object",
                                   "additionalProperties": false,
                                   "required": [
                                     "consumerSecret",
                                     "accessTokenKey",
                                     "accessTokenSecret"
                                   ],
                                   "properties": {
                                     "accountName": {
                                       "type": ["string", "null"],
                                       "maxLength": 255
                                     },
                                     "consumerKey": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "consumerSecret": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "accessTokenKey": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "accessTokenSecret": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "enableAutoPublish": {
                                       "type": "boolean"
                                     },
                                     "userName": {
                                       "type": ["string", "null"],
                                       "maxLength": 255
                                     },
                                     "active": {
                                       "type": "boolean"
                                     }
                                   }
                                 }
                               },
                               "linkedIn": {
                                 "type": "array",
                                 "items": {
                                   "type": "object",
                                   "additionalProperties": false,
                                   "required": [
                                     "clientId",
                                     "clientSecret"
                                   ],
                                   "properties": {
                                     "accountName": {
                                       "type": ["string", "null"],
                                       "maxLength": 255
                                     },
                                     "companyId": {
                                       "type": ["string", "null"],
                                       "maxLength": 255
                                     },
                                     "clientId": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "clientSecret": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "accessToken": {
                                       "type": ["string", "null"],
                                       "maxLength": 255
                                     },
                                     "enableAutoPublish": {
                                       "type": "boolean"
                                     },
                                     "active": {
                                       "type": "boolean"
                                     }
                                   }
                                 }
                               },
                               "facebook": {
                                 "type": "array",
                                 "items": {
                                   "type": "object",
                                   "additionalProperties": false,
                                   "required": [
                                     "pageId",
                                     "clientId",
                                     "clientSecret"
                                   ],
                                   "properties": {
                                     "accountName": {
                                       "type": ["string", "null"],
                                       "maxLength": 255
                                     },
                                     "pageId": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "clientId": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "clientSecret": {
                                       "type": "string",
                                       "minLength": 1,
                                       "maxLength": 255
                                     },
                                     "accessToken": {
                                       "type": "string",
                                       "minLength": 1
                                     },
                                     "enableAutoPublish": {
                                       "type": "boolean"
                                     },
                                     "active": {
                                       "type": "boolean"
                                     }
                                   }
                                 }
                               }
                             }
                           }
                         }
                       }
                     },
                     "constraintType": "socialPublishing"
                   }

var data = {
              "affiliateId": "69",
              "affiliateName": "KCBD",
              "socialTools": {
                "publishing": {
                  "twitter": [
                    {
                      "accountName": "accountName",
                      "consumerKey": "consumerKey",
                      "consumerSecret": "consumerSecret",
                      "accessTokenKey": "accessTokenKey",
                      "accessTokenSecret": "accessTokenSecret",
                      "enableAutoPublish": true,
                      "userName": "userName",
                      "active": true
                    }
                  ],
                  "linkedIn": [
                    {
                      "accountName": "",
                      "companyId": "companyId",
                      "clientId": "",
                      "clientSecret": "clientSecret",
                      "enableAutoPublish": true,
                      "active": true
                    }
                  ],
                  "facebook": [
                    {
                      "accountName": "accountName",
                      "pageId": "pageId",
                      "clientId": "clientId",
                      "clientSecret": "clientSecret",
                      "enableAutoPublish": true,
                      "accessToken": "",
                      "active": true
                    }
                  ]
                }
              }

          }


var result = tv4.validateMultiple(data, commonSchema);
console.log(customizeErrors(result.errors));


var schema1 =  {
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
                        "enum": [
                          "preroll",
                          "midroll",
                          "postroll"
                        ],
                        "errorMessage": {
                          "1": "Must be one of [preroll, midroll, postroll]."
                        }
                      },
                      "vastUrl": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "maxLength": 2048,
                        "pattern": "/^(https?|ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i",
                        "errorMessage": {
                          "202": "You must enter a valid link."
                        }
                      },
                      "timeOffset": {
                        "type": [
                          "integer",
                          "null"
                        ]
                      },
                      "enabled": {
                        "type": "boolean"
                      },
                      "isDefault": {
                        "type": "boolean"
                      }
                    }
                  }
               };
var data1 = [
             {
                "type" : "preroll",
                "vastUrl" : "https://www.Automation551352.com",
                "timeOffset" : 0,
                "enabled" : true,
                "isDefault" : true
             }

            ];

//      var result1 = tv4.validateMultiple(data1, schema1);
//      console.log(customizeErrors(result1.errors));


function customizeErrors(jsonError) {
  for (var i = 0; i < jsonError.length; i ++) {
    var dataPath = jsonError[i]["dataPath"];
    dataPath = dataPath.substring(1, dataPath.length).replace(/[/]/g, '.');
    jsonError[i]["dataPath"] = dataPath;
    delete jsonError[i]["params"];
    delete jsonError[i]["schemaPath"];
    delete jsonError[i]["subErrors"];
    delete jsonError[i]["stack"];
  }
  return jsonError;
}

/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
