var constant = require("./const.json");


var Util = function() {
    Util.prototype.restructureManifestJSON = function(json) {
        return convertNode(json);
    }

    function convertNode(data) {
        var rs = {};
        var key = '';
        var value = '';
        for (var attribute in data) {
            // check invalid sttribute
            if (attribute == "__text" || attribute == "toString" ) {
                delete data[attribute];
                continue;
            }

            //
            if (typeof(data[attribute]) != 'object') {
                value = data[attribute];
                if (constant.booleanList.indexOf(attribute) >= 0) {
                     value = value.toLowerCase() == "true" ? true : false;
                }
                rs[attribute] = value;
            } else {

                if (constant.arrayNode.indexOf(attribute) < 0) {
                    rs[attribute] = convertNode(data[attribute]);
                } else  {
//                    console.log("attribute>>> " + attribute);
                    rs[attribute] = convertArray(data[attribute], attribute);
                }
            }
        }
        return rs;
    };

    function convertArray(data, attribute) {
        var result = [];
        var child = {};
        if (Array.isArray(data)) {
            for (var index = 0; index < data.length; index++) {
                item = data[index];
                result.push(convertNode(item));
            }
            return result;
        } else {
            console.log("attribute>>> " + attribute);
           var a = convertNode(data);

            result.push(a);
            return result
        }
    };



}
module.exports = Util;