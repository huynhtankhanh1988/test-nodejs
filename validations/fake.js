var express = require('express');
var https = require('https');
var request = require('request');
var fs = require("fs");
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var app = module.exports = express();
var tv4 = require('tv4');


function print2() {
    console.log("print2");
}

var Fake = function() {
   Fake.prototype.print1 = function() {
    console.log('print1');
    print2();
    print3();
    this.print4();
   }

   function print3() {
       console.log("print3");
   }

  Fake.prototype.print4 = function() {
   console.log('print4');
  }

}
module.exports = Fake;