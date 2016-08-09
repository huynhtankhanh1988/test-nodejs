var constraints = require('./common-constraints-new');
var validator = require('schema-inspector');;

var JsonValidator = function(){};

JsonValidator.prototype.validateUrl = function(data) {
  return validator.validate(constraints.url, data);
}

JsonValidator.prototype.validateText = function(data) {
  return validator.validate(constraints.text, data);
}

JsonValidator.prototype.validatePhoneNumber = function(data) {
  return validator.validate(constraints.phone, data);
}

JsonValidator.prototype.validateColor = function(data) {
  return validator.validate(constraints.color, data);
}

JsonValidator.prototype.validateEmail = function(data) {
  return validator.validate(constraints.email, data);
}

JsonValidator.prototype.validateUnsignInteger = function(data) {
  return validator.validate(constraints.unsigned_integer, data);
}

JsonValidator.prototype.validatePercentage = function(data) {
  return validator.validate(constraints.percentage, data);
}

JsonValidator.prototype.validateLongtitude = function(data) {
  return validator.validate(constraints.longtitude, data);
}

JsonValidator.prototype.validateLatitude = function(data) {
  return validator.validate(constraints.latitude, data);
}

JsonValidator.prototype.validatePassword = function(data) {
  return validator.validate(constraints.password, data);
}

module.exports = JsonValidator;
