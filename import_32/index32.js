/**
 * Module dependencies.
 */
  var express = require('express')
  var https = require('https');
  var request = require('request');
  var fs = require("fs");
  var bodyParser = require('body-parser');
  var app = module.exports = express();
  var parseString = require('xml2js').parseString;
  var XmlConverter = require("./app-import-tool-v3.2/xml-converter");
  var xmlConverter = new XmlConverter();
  var X2JS = require("x2js");
  var x2js = new X2JS();

    app.get('/', function(req, res) {
     fs.readFile("android.xml",'utf-8', function (err, data) {
        if (err) {
            console.log("ERROR 0");
            res.end(err);
        } else {
            var json = xmlConverter.convertXML2ItemConfig('android', data.toString(), function(err, itemConfig){
                if(err) {
                   res.status(500);
                   res.json({code: 500, msg: err.message});
                } else {
                    res.json({client: itemConfig});
                }
            });
        }
      });
    });



app.listen(4000, function(){
  console.log("Express server listening on port 4000");
});
