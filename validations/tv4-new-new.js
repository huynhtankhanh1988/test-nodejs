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
                     "properties": {
                       "networkType": {
                         "type": "string",
                         "enum": [
                           "dfp",
                           "verve",
                           "verve-dfp-mediation"
                         ],
                         "errorMessage": {
                           "1": "Must be one of [dfp, verve, verve-dfp-mediation]."
                         }
                       },
                       "target": {
                         "type": "string",
                         "pattern": "^[1-9]{1}[0-9]{0,}$",
                         "errorMessage": {
                           "202": "Please use positive number."
                         }
                       }
                     }
                   }

       var data = {
        networkType: "dfp",
        target: "0"
       }

commonSchema = {
    type: "string",
    pattern: "^[1-9][0-9]?$|^100$",
     "errorMessage": {
       "202": "Please use positive number within 100."
     }
}

data = "09";



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
