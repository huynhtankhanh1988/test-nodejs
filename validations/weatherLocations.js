/**
 * Module dependencies.
 */

var express = require('express');
var https = require('https');
var fs = require("fs");
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var app = module.exports = express();
var tv4 = require('tv4');
var schema = require('./cloud-code-data.json');

function buildFullSchema(schema, definitions) {
    for (var key in schema) {
        if (typeof(schema[key]) == 'object' && !schema[key]['$ref'] && !Array.isArray(schema[key])) {
            buildFullSchema(schema[key], definitions);
        } else if (typeof(schema[key]) == 'object' && schema[key]['$ref']) {
              var refKey = schema[key]['$ref'];
              var objName = refKey.substring(refKey.lastIndexOf('/') + 1, refKey.length);
              schema[key] = definitions[objName];
        }
    }
    return schema;
}

var ddd = buildFullSchema(schema, schema.definitions);
console.log(JSON.stringify(ddd));

/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
