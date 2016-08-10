var parseString = require('xml2js').parseString;
var X2JS = require("x2js");
var x2js = new X2JS();

var Util = require('../util');
var util = new Util();


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
                if (result.client) {
                    var outputJson = {};
                    outputJson = x2js.xml2js(xmlString);
                    var data = util.restructureManifestJSON(outputJson.client);
                    callback(null, data);
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