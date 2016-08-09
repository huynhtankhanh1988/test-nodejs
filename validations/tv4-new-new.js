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
//        if(error['code'] == 302) {
//            if(error['dataPath']) {
//                error["dataPath"] = error + "." + error["params"]['key'];
//            } else {
//                error["dataPath"] = error["params"]['key'];
//            }
//        }

//    console.log(JSON.stringify(error, null, 4));

//    console.log("=======data: " + JSON.stringify(data) + " schema: " + JSON.stringify(schema, null ,4));
//     console.log("===================================" + JSON.stringify(schema.type, null, 2));
//    console.log("===================================");
//    console.log("errorMessage===================================" + JSON.stringify(schema['errorMessage'], null, 2));
//    console.log("schema.errorMessage[error.code]===================================" + schema.errorMessage[302]);
    if (schema.errorMessage && schema.errorMessage[error.code]) {
        return schema.errorMessage[error.code];
    }
    return;
});

var commonSchema = {
                     "type": "object",
                     "additionalProperties": false,
                     "required": [
                       "enabled",
                       "font1",
                       "vastUrl",
                       "timeOffset"
                     ],
                     "properties": {
                       "enabled": {
                         "type": "boolean"
                       },
                       "font1": {
                         "type": "string",
                         "enum": [
                           "Sans Serif",
                           "Serif",
                           "Serif / Sans Serif"
                         ],
                         "errorMessage": {
                           "1": "Must be one of [Sans Serif, Serif, Serif / Sans Serif].",
                           "302": "This field is required."
                         }
                       },
                       "timeOffset": {
                         "type": "string",
                         "default": "0",
                         "pattern": "^\\d+$",
                         "errorMessage": {
                           "202": "Please use only numbers.",
                           "302": "This field is required."
                         },
                         "maxLength": 20,
                         "minLength": 1
                       },
                       "vastUrl": {
                         "type": "string",
                         "maxLength": 2048,
                         "minLength": 1,
                         "pattern": "^((http(s)?|ftp):\\/\\/)(www\\.)?[a-zA-Z0-9-_\\.]+(\\.[a-zA-Z0-9]{2,})([-a-zA-Z0-9:%_\\+.;~#?&//=]*)$",
                         "errorMessage": {
                           "202": "You must enter a valid link.",
                           "302": "This field is required."
                         }
                       }
                     }
                   }

       var data = {enabled: true}
//       var data = {enabled: "", font1: "df", timeOffset: "gggd", vastUrl: "ddd"}

    var a = {
                                      "type": "string",
                                      "maxLength": 2048,
                                      "minLength": 1,
                                      "pattern": "^((http(s)?|ftp):\\/\\/)(www\\.)?[a-zA-Z0-9-_\\.]+(\\.[a-zA-Z0-9]{2,})([-a-zA-Z0-9:%_\\+.;~#?&//=]*)$",
                                      "errorMessage": {
                                        "302": "This field is required.",
                                        "202": "You must enter a valid link."

                                      }
                                    }

//console.log("---ggg: " + a['errorMessage']['202']);


var result = tv4.validateMultiple(data, commonSchema);
result.errors = customizeErrors(result.errors);
//result.errors = buildErrorTree( result.errors, "advertising");
console.log(result.errors);

function customizeErrors(jsonError) {
    for (var i = 0; i < jsonError.length; i++) {
        var dataPath = jsonError[i]["dataPath"];
        dataPath = dataPath.substring(1, dataPath.length).replace(/[/]/g, '.');
        jsonError[i]["dataPath"] = dataPath;


        if(jsonError[i]["code"] == 302) {
            jsonError[i]["message"] = "This field is required.";
            if(dataPath) {
                jsonError[i]["dataPath"] = dataPath + "/" + jsonError[i]["params"]['key'];
            } else {
                jsonError[i]["dataPath"] = jsonError[i]["params"]['key']
            }
        }

        delete jsonError[i]["params"];
        delete jsonError[i]["schemaPath"];
        delete jsonError[i]["subErrors"];
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
