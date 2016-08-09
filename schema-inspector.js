/**
 * Module dependencies.
 */

var express = require('express')
var routes = require('./routes');
var https = require('https');
var request = require('request');
var fs = require("fs");
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var ctl = require('./controller/controller');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-d

var app = module.exports = express();
var js2xmlparser = require("js2xmlparser");
var validate = require("validate.js");
var data = require( './data/full-data.json');
var constraints = require('./constraints/full-contraints.json');
var inspector = require('schema-inspector');

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
var schema = {
    type: 'object',
    properties: {
        lorem: {  type: 'number', error: "not number", code: 101 },
        ipsum: { type: 'number' },
        dolor: { type: ['number', 'string', 'null'] }
    }
};
var c1 = {
    lorem: "gg",
    ipsum: 'sit amet',
    dolor: 'ddd',
    sit: {}
};
//console.log(inspector.validate(schema, c1)); // Valid
 schema = {
    type: 'array',
    items: { type: 'object' }
};
var c = [ {a: 12.23 }, -34, true, false, 'true', 'false', [123, 234, 345], { obj: "yes" } ];
var r = inspector.validate(schema, c);
//console.log(r);
schema = {
  type: 'string',
  pattern: /^\d{10}$/,
  minLength: 10,
  maxLength: 10,
  error: 'invalid string'
}
//r = inspector.validate(schema, '444466hh6666');
//console.log(r);
var data = {
  name: "khanh",
  address: {
    no: 36,
    street: '19/5B'
  }
}
schema = {
  type: 'object',
  properties: {
     name : {type: 'number'},
     address: {type:'object'}
  }
}
var addressSchema = {
  type : 'object',
  properties: {
     no : {type: 'number'},
     street: {type: 'string'}
  }
}
r = inspector.validate(schema, data);
// console.log(r);

// var constr = require('./common-constraints-new');
// var urlValidate = inspector.validate(constr.url, "http://lll.com.vn");
// console.log("urlValidate>> " + JSON.stringify(urlValidate));
//
// var textValidate = inspector.validate(constr.text, "1234567890");
// console.log("textValidate>> " + JSON.stringify(textValidate));
//
// var phoneValidate = inspector.validate(constr.phone, "0909090909");
// console.log("phoneValidate>>>" + JSON.stringify(phoneValidate));
//
// var colorValidate = inspector.validate(constr.color, "#FFFFFF");
// console.log("colorValidate>>>" + JSON.stringify(colorValidate));
//
// var unsignedIntegerValidate = inspector.validate(constr.unsigned_integer, 123);
// console.log("unsignedIntegerValidate>>>" + JSON.stringify(unsignedIntegerValidate));
//
// var percentageValidate = inspector.validate(constr.percentage, 100);
// console.log("percentageValidate>>>" + JSON.stringify(percentageValidate));
//
// var longtitudeValidate = inspector.validate(constr.longtitude, "179.9");
// console.log("longtitudeValidate>>>" + JSON.stringify(longtitudeValidate));
//
// var latitudeValidate = inspector.validate(constr.latitude, "89.999999");
// console.log("latitudeValidate>>>" + JSON.stringify(latitudeValidate));
//
// var passwordValidate = inspector.validate(constr.password, "999999");
// console.log("passwordValidate>>>" + JSON.stringify(passwordValidate));
//
// var schema1 = {
// 	type: 'string',
//   optional: true
// }
// var optionalValidate = inspector.validate(schema1, "");
// console.log("optionalValidate>>>" + JSON.stringify(optionalValidate));

var JsonValidator = require('./json-validator-new');
var validator = new JsonValidator();

var url = validator.validateUrl("http://google.com.vn");
console.log(url);

app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
