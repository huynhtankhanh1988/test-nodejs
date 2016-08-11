var constant = require("./const.json");
var mapping = require("./mapping.json");

var AndroidConverter = function() {
    AndroidConverter.prototype.combineItemConfig = function(preJson) {
        return doCombineItemConfig(preJson);
    }

    function doCombineItemConfig(preJson) {
        return preJson;
    }

}
module.exports = AndroidConverter;