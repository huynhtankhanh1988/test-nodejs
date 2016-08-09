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

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//console.log("data>> " + JSON.stringify(data));
//console.log("constraints>> " + constraints);
//console.log(data.premiumFeeds);
//console.log(constraints.premiumFeeds);
// console.log(validate(data.premiumFeeds, constraints.premiumFeeds));
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

//var list = validateRecursive(data);
//console.log(list.length);
function validateRecursive(json) {
  var errs = [];
  for (var attr in json) {
    if (typeof(json[attr]) == "object") {
      if (Array.isArray(json[attr])) {
        var firstValue = json[attr][0];
        if (typeof(firstValue) == "object") {
        //  errs.push.apply(errs, validateRecursive(json[attr]));
        }
      } else {
        if(constraints[attr]) {
          // console.log(attr);
        // console.log(attr);
        // errs.push.apply(errs, validateRecursive(json[attr]));
        var d = JSON.stringify(json[attr]);
        // console.log( "data> " + d);

        var constr = {};
        constr[attr] = constraints[attr];

        // console.log("cons> " + JSON.stringify(constraints[attr]));
        console.log(validate(JSON.parse(d), constraints[attr]));
        var v =  validate(JSON.parse(d), constraints[attr])
        if(v != null) {
          errs.push(v);
        }

      }
    }
  }
   else {
     if(constraints[attr]) {
      var constr = {};
      constr[attr] = constraints[attr];
       console.log("att " + json[attr])
       console.log("const " +JSON.stringify(constr));
      var err = validate.single(json[attr], constraints[attr]);
      // console.log(JSON.stringify(err) == null);
      if(err != null) {
         console.log(err);
        errs.push(err);
      }
     }
    }
  }

 return errs;
}

//
// var  premiumFeeds = {
//     "apiKey": "key11",
//     "contextAffiliateId": "affiliateid1"
//   };
//   var  c = {
//     "apiKey": {"presence": true}
//   }
//
// console.log( JSON.stringify(premiumFeeds));
// console.log(JSON.stringify(c));
// console.log(validate(premiumFeeds, c));
console.log(validate({}, {username: {presence: true}}));

app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
