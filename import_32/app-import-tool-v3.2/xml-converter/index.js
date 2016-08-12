var parseString = require('xml2js').parseString;
var X2JS = require("x2js");
var x2js = new X2JS();

var Util = require('../util');
var util = new Util();

var AndroidConverter = require('../android');
var androidConverter = new AndroidConverter();

var IOSConverter = require('../ios');
var iOSConverter = new IOSConverter();

// number regex
var reg = /^\d+$/;

var XmlConverter = function() {
    XmlConverter.prototype.convertXML2ItemConfig = function(platform, xmlString, callback) {
        convertXML2ItemConfig(platform, xmlString,  function(err, data){
            return callback(err, data);
        });
    }

    //
    function convertXML2ItemConfig(platform, xmlString, callback) {
        parseString(xmlString, function(err, result) {
            if (err) {
                console.log(err);
                callback(err, null);
                return;
            } else {
                if (result.client) {// checking root tag must be 'client'
                    var outputJson = {};
                    outputJson = x2js.xml2js(xmlString);
                    var data = util.restructureManifestJSON(outputJson.client);

                    //START VALIDATION
                    if (!reg.test(data["_frn-affiliate-id"])) { // check if affiliate id is null o not a number
                        callback({
                            code: 500,
                            message: "Invalid XML Manifest, frn-affiliate-id key must be a number."
                        }, null);
                        return;
                    }

                    var preCheck = checkPlatform(data, platform);
                    if (preCheck == 0) {
                        callback({
                            code: 500,
                            message: "Invalid XML Manifest. XML Manifest is empty."
                        }, null);
                        return;
                    } else if (preCheck == -1) {
                        callback({
                            code: 500,
                            message: "Invalid XML Manifest. It does not match with the platform of your choice."
                        }, null);
                        return;
                    }
                    //END VALIDATION

                    //START COMBINE ITEM CONFIG
                    var itemConfig = {};
                    if (platform.toLowerCase() === 'android') {
                        itemConfig = androidConverter.combineItemConfig(data);
                    } else {
                        itemConfig = iOSConverter.combineItemConfig(data);
                    }
                    //END COMBINE ITEM CONFIG

                    callback(null, itemConfig);
                } else {
                    callback({
                        code: 500,
                        message: 'Invalid root tag. Root tag must be <client>'
                    }, null);
                    return;
                }
            }
        });
    }

    /**
        Checking if cross platform
        Return:
         + 0: No data
         + 1:
         + 2:
    */
    function checkPlatform(preJson, platform) {
        if (!preJson || Object.keys(preJson).length == 0) {
            return 0;
        }
        var weather = preJson.weather;
        var weatherV2 = preJson["weather-v2"];
        if (platform.toLowerCase() === 'android') {
            if (!weather || Object.keys(weather).length == 0) {
                if (weatherV2 && Object.keys(weatherV2).length > 0) {
                    return -1;
                }
            }
        } else {
            if (!weatherV2 || Object.keys(weatherV2).length == 0) {
                if (weather && Object.keys(weather).length > 0) {
                    return -1;
                }
            }
        }
        return 1;
    }

}

module.exports = XmlConverter;

//
//        var outputJson = {};
//        try {
//            outputJson = x2js.xml2js(xmlString);
//            console.log("lalala " + outputJson);
//        } catch (e) {
//           console.log(e.message);
//        }
//        return outputJson;