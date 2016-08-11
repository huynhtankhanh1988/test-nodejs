var constant = require("./const.json");


var Util = function() {
    Util.prototype.restructureManifestJSON = function(json) {
        return convertNode(json);
    }

    Util.prototype.mappingNode = function(data, mapping) {
        return doMappingNode(data, mapping);
    }

    Util.prototype.mappingArray = function(data, mapping) {
        return doMappingArray(data, mapping);
    }

    function convertNode(data) {
        var rs = {};
        var key = '';
        var value = '';
        for (var attribute in data) {
            // remove unsuitable attributes
            if (attribute == "__text" || attribute == "toString" ) {
                delete data[attribute];
                continue;
            }

            //do convert
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
            result.push(convertNode(data));
            return result
        }
    };

    function doMappingNode(data, mapping) {
        var rs = {};
        var key = '';
        var value = '';
        for (var attribute in data) {
            if (typeof(data[attribute]) != "object") {
                key = mapping[attribute];
                value = data[attribute];
                if (key) {
                    if (attribute == "suppress-ads" && key == 'showAds') {
                        value = !value;
                    }
                    rs[key] = value;
                }
            } else {
                key = mapping[attribute];
                if (key) {
                    if (arrayNode.indexOf(attribute) < 0) {
                        rs[key] = doMappingNode(data[attribute], mapping);
                    } else {
                        if (Array.isArray(data[attribute])) {
                            rs[key] = doMappingArray(data[attribute], mapping);
                        } else {
                            rs[key] = doMappingNode(data[attribute], mapping);
                        }
                    }
                }
            }
        }
        return rs;
    };

    function doMappingArray(data, mapping) {
        var item = {};
        var result = [];
        var child = {};
        if (data && data.length >= 1) {
            for (var index = 0; index < data.length; index++) {
                item = data[index];
                result.push(doMappingNode(item, mapping));
            }
            return result;
        } else {
            return null;
        }
    };

}
module.exports = Util;