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
    console.log(error);
    if (schema.errorMessage && schema.errorMessage[error.code]) {
        return schema.errorMessage[error.code];
    }
    if(error.code===0 && !data){
        return "This field is required.";

    }
    return;
});

var commonSchema = {
                      "type": "array",
                      "item": {
                          "type": "object",
                          "additionalProperties": false,
                          "required":["apiKey", "contextAffiliateId"],
                            "properties": {
                              "apiKey": {
                                "type": "string",
                              },
                              "contextAffiliateId": {
                                "type":  "string",
                              }
                            }
                        }
                    }

       var data =  [
            null,
            {
             "apiKey": "1111",
             "contextAffiliateId": null
            },
            null
       ]


modifyEmptyFields(data);
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

function modifyEmptyFields(json) {
    for (var att in json) {
        if (isEmpty(json[att])) {
            if (typeof(json[att]) != 'object') {
                json[att] = null;
            }
        } else {
            var child = json[att];
            if (typeof(child) == 'object') {
                if (Array.isArray(child)) {
                    for (var i = 0; i < child.length; i++) {
                        modifyEmptyFields(child[i]);
                    }
                } else {
                    modifyEmptyFields(child);
                }
            }
        }
    }
    return json;
}

function isEmpty(obj) {
  if (typeof(obj) === 'boolean' || typeof(obj) === 'number'){
    return false;
  }

  if (!obj){
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

/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
