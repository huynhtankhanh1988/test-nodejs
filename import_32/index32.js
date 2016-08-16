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

  var fileName = "ios.xml";
  var platform = "iOS";
  var appType = platform === 'iOS' ? 'iPhone' : platform;

    app.get('/', function(req, res) {
     fs.readFile(fileName,'utf-8', function (err, data) {
        if (err) {
            res.end(err);
        } else {
            var json = xmlConverter.convertXML2ItemConfig(platform, data.toString(), function(err, itemConfig){
                if(err) {
                   res.status(500);
                   res.json({code: 500, msg: err.message});
                } else {
                    if (!itemConfig.ex) {
                        console.log('thanh cong ');
                        //
						itemConfig["name"] = "import " + platform;
						itemConfig["appType"] = appType;
						itemConfig["platform"] = platform;
						itemConfig["isActive"] = true;
						itemConfig["themeType"] = "custom";
                        //
                        res.json({client: itemConfig});
                    } else {
                        res.status(500);
                        res.json({code:500, msg: "Create new App configuration unsuccessfully!", err: itemConfig.ex.message});
                    }
                }
            });
        }
      });
    });

app.listen(4000, function(){
  console.log("Express server listening on port 4000");
});
