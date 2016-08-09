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
/**
  Set custom message
*/
tv4.setErrorReporter(function(error, data, schema) {
    if (schema.errorMessage && schema.errorMessage[error.code]) {
        return schema.errorMessage[error.code];
    }
    return;
});

var commonSchema = {
                           "type": "array",
                           "items": {
                             "type": "object",
                             "additionalProperties": false,
                             "required": [
                               "network",
                               "networkKey",
                               "adTarget",
                               "type",
                               "vastUrl",
                               "timeOffset",
                               "enabled"
                             ],
                             "properties": {
                               "excludeDevice": {
                                 "type": [
                                   "string",
                                   "null"
                                 ],
                                 "enum": [
                                   "iPhone",
                                   "iPad",
                                   null
                                 ],
                                 "errorMessage": {
                                   "1": "Must be one of [\"\", iPhone, iPad]."
                                 }
                               },
                               "bannerEnabled": {
                                 "type": "boolean"
                               },
                               "network": {
                                 "type": "string",
                                 "minLength": 1,
                                 "enum": [
                                   "DFP",
                                   "Verve",
                                   "AdMob"
                                 ],
                                 "errorMessage": {
                                   "1": "Must be one of [DFP, Verve, AdMob].",
                                   "200": "This field is required."
                                 }
                               },
                               "networkKey": {
                                 "type": "string",
                                 "maxLength": 255,
                                 "minLength": 1,
                                 "errorMessage": {
                                   "200": "This field is required."
                                 }
                               },
                               "adTarget": {
                                 "type": "string",
                                 "maxLength": 255,
                                 "minLength": 1,
                                 "errorMessage": {
                                   "200": "This field is required."
                                 }
                               },
                               "inlineAdKey": {
                                 "type": [
                                   "string",
                                   "null"
                                 ],
                                 "maxLength": 255
                               },
                               "autoHideBanner": {
                                 "type": "boolean"
                               },
                               "inlineRefresh": {
                                 "type": [
                                   "string",
                                   "null",
                                   "number"
                                 ],
                                 "pattern": "^\\d+$",
                                 "errorMessage": {
                                   "202": "Please use only numbers."
                                 },
                                 "maxLength": 255
                               },
                               "inlineLocation": {
                                 "type": [
                                   "string",
                                   "null",
                                   "number"
                                 ],
                                 "pattern": "^\\d+$",
                                 "errorMessage": {
                                   "202": "Please use only numbers."
                                 },
                                 "maxLength": 255
                               },
                               "inlineEnabled": {
                                 "type": "boolean"
                               },
                               "showNativeAds": {
                                 "type": "boolean"
                               },
                               "adUrl": {
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
                               "type": {
                                 "type": "string",
                                 "enum": [
                                   "preroll",
                                   "midroll",
                                   "postroll"
                                 ],
                                 "minLength": 1,
                                 "errorMessage": {
                                   "1": "Must be one of [preroll, midroll, postroll].",
                                   "200": "This field is required."
                                 }
                               },
                               "vastUrl": {
                                 "type": "string",
                                 "maxLength": 2048,
                                 "minLength": 1,
                                 "pattern": "^((http(s)?|ftp):\\/\\/)(www\\.)?[a-zA-Z0-9-_\\.]+(\\.[a-zA-Z0-9]{2,})([-a-zA-Z0-9:%_\\+.;~#?&//=]*)$",
                                 "errorMessage": {
                                   "202": "You must enter a valid link.",
                                   "200": "This field is required."
                                 }
                               },
                               "timeOffset": {
                                 "type": "string",
                                 "errorMessage": {
                                   "200": "This field is required."
                                 },
                                 "maxLength": 20,
                                 "minLength": 1
                               },
                               "enabled": {
                                 "type": "boolean"
                               },
                               "randomNumberParameter": {
                                 "type": [
                                   "string",
                                   "null"
                                 ]
                               }
                             }
                           }
                         }

       var data =  [
                          {
                              "excludeDevice": null,
                              "bannerEnabled": false,
                              "network": "DFP",
                              "networkKey": "3",
                              "adTarget": "2",
                              "inlineAdKey": "2",
                              "autoHideBanner": false,
                              "inlineRefresh": "1",
                              "inlineLocation": "1",
                              "inlineEnabled": false,
                              "showNativeAds": false,
                              "adUrl": null,
                              "type": "preroll",
                              "vastUrl": "http://google.com.vn",
                              "timeOffset": "2",
                              "enabled": true,
                              "randomNumberParameter": "www"
                          },
                          {
                              "excludeDevice": "iPad",
                              "network": "DFP",
                              "networkKey": null,
                              "adTarget": null,
                              "inlineAdKey": null,
                              "showNativeAds": true,
                              "adUrl": null,
                              "type": "preroll",
                              "vastUrl": null,
                              "timeOffset": null,
                              "randomNumberParameter": ":\";ord=\", default \"",
                              "enabled": false,
                              "bannerEnabled": true,
                              "autoHideBanner": true,
                              "inlineRefresh": "60",
                              "inlineLocation": "3",
                              "inlineEnabled": true
                          }
                      ]


var result = tv4.validateMultiple(data, commonSchema);
result.errors = customizeErrors(result.errors);
//result.errors = buildErrorTree( result.errors, "advertising");
console.log(result.errors);

function customizeErrors(jsonError) {
    for (var i = 0; i < jsonError.length; i++) {
        var dataPath = jsonError[i]["dataPath"];
        dataPath = dataPath.substring(1, dataPath.length).replace(/[/]/g, '.');
        jsonError[i]["dataPath"] = dataPath;


//        if(jsonError[i]["code"] == 302) {
//            if(dataPath) {
//                jsonError[i]["dataPath"] = dataPath + "/" + jsonError[i]["params"]['key'];
//            } else {
//                jsonError[i]["dataPath"] = jsonError[i]["params"]['key']
//            }
//        }
//
//        delete jsonError[i]["params"];
//        delete jsonError[i]["schemaPath"];
//        delete jsonError[i]["subErrors"];
        delete jsonError[i]["stack"];
    }
    return jsonError;
}

function buildErrorTree(arrayError, dataPath){
    var errorTree = {};
	    for (var i = 0; i < arrayError.length; i++ ) {
	    	// error without dataPath
	    	if(!arrayError[i].dataPath){
	    		errorTree[dataPath] = arrayError[i].message;
	    	}else{
	    		if(!dataPath){
	    			// dataPath is null - errorTree key will be datapath in arrayError[i]
					errorTree[arrayError[i].dataPath] = arrayError[i].message;
				}else{
					// dataPath have value
					errorTree[dataPath + '.' + arrayError[i].dataPath] = arrayError[i].message;
				}
	    	}
	   	}
    return errorTree;
};

/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
