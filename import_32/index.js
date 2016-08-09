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

    app.get('/', function(req, res) {
     fs.readFile("ios.xml", function (err, data) {
        if (err) {
            console.log("ERROR 0");
            res.end(err);
        } else {
            convertXML2JS(data, function(error, result) {
                if (error) {
                   console.log("ERROR 1");
                } else {
//                   res.json({data: result.client});
                 var rs = convertNode(result.client);
                 res.json({data: rs});
                }
            });
        }
      });
    });

    function convertXML2JS(xmlString, callback){
        parseString(xmlString, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            } else {
                callback(null, result);
            }
        })
    }

    function convertNode(data){
      var rs = {};
      var key = '';
      var value = '';
        if(data.length == 1){
          data = data[0]? data[0] : data;
        }
        for(var attribute in data){
          if(attribute == "$"){
            for(var att in data["$"]){
              value = data["$"][att];
              rs[att] = value;
            }
          }else{
              if (data[attribute] && Array.isArray(data[attribute]) && data[attribute].length > 1){
                rs[attribute] = convertArray(data[attribute]);
              } else {
                rs[attribute] = convertNode(data[attribute]);
              }
          }
        }
        return rs;
    };

    function convertArray(data){
      var item = {};
      var result = [];
      var child = {};
      if(data && data.length >= 1){
        for(var index = 0; index < data.length; index++){
            item = data[index];
            result.push(convertNode (item));
        }
        return result;
      }else{
        return null;
      }
    };

app.listen(4000, function(){
  console.log("Express server listening on port 4000");
});
