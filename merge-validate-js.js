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
var Merge = require('./merge-recursive');
var merge = new Merge();
var coc = require('./common-constraints');

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var con = {
   platform :  {"presence": true}
};

var data = {
  target: "platform",
  extend: {
    "length": {
      "minimum": 3,
      "maximum": 10
    }
  }
};

var mergeConstraint = {};
 for (var attr in data) {
   if(con[data[attr]]) {
    //  console.log("con[data[attr] " + con[data[attr]]);
    //  console.log("data[attr] " + data[attr]);
     mergeConstraint = merge.merge(con[data[attr]], data["extend"])
   }
 }

// console.log(mergeConstraint);

data = merge.merge(data, mergeConstraint);
delete data["target"];
delete data["extend"];

var constraints = {
  // key1: {
  //   length: {
  //     is: 3,
  //     wrongLength: "should be only %{count} words"
  //   }
  // },
  // key2: {
  //   length: {
  //     minimum: 20,
  //     tooShort: "needs to have %{count} words or more",
  //     maximum: 30,
  //     tooLong: "needs to have less then %{count} words",
  //   }
  // },
  // key3: {length: {maximum: 3}},
  key4: {
    length: {
      minimum: 3,
      tooShort: "needs to have %{count} words or more",
      message: "no"
    }
  }
};

var i = validate({}, constraints);
// console.log(i == null);

var values = {
  key1: "wre",
  key2: "too shortsdfdsfsdfsdf",
  key3: "tood",
  key4: "to"
};
//console.log(JSON.stringify(values));
//console.log(JSON.stringify(constraints));
// console.log(validate(values, constraints));

// var percentageValidate = validate.single(99, coc.percentage);
// console.log("percentage: " +  percentageValidate);
//
// var passwordValidate = validate.single("199122", coc.password);
// console.log("passwordValidate: " +  passwordValidate);
//
// var latitudeValidate = validate.single("90", coc.latitude);
// console.log("latitudeValidate: " +  latitudeValidate);
//
// var longtitudeValidate = validate.single("180", coc.longtitude);
// console.log("longtitudeValidate: " +  longtitudeValidate);
//
// var unsignIntegerValidate = validate.single("-111122", coc.unsigned_integer);
// console.log("unsignIntegerValidate: " +  unsignIntegerValidate);
//
var emailValidate = validate.single("khanh.huynhdkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgkhanh.huynhddddddddddgdddddddddgmail.com", coc.email);
console.log("emailValidate: " + JSON.stringify(emailValidate));
//
// var colorValidate = validate.single("#ffffff", coc.color);
// console.log("colorValidate: " +  colorValidate);
//
// var phoneCons = {};
// phoneCons.phone = coc.phone;
var phoneValidate = validate.single("11DFGFDHFGHGFHFGHGFHGF11111111", coc.phone);
console.log("phoneValidate: " +  JSON.stringify(phoneValidate));
//
// var textValidate = validate.single("ddd", coc.text);
// console.log("textValidate: " +  textValidate);
//
// var urlValidate = validate.single("http://google.com.vn", coc.url);
// console.log("urlValidate: " +  urlValidate);


var JsonValidator = require('./json-validator');
var validator = new JsonValidator();

var url = validator.validateUrl("dfgdfg");
console.log(url);


app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
