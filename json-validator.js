var constraints = require('./common-constraints');
var validator = require("validate.js");

var JsonValidator = function(){};

JsonValidator.prototype.validateUrl = function(data) {
  return validator.single(data, constraints.url);
}

JsonValidator.prototype.validateText = function(data) {
  return validator.single(data, constraints.text);
}

JsonValidator.prototype.validatePhoneNumber = function(data) {
  return validator.single(data, constraints.phone);
}

JsonValidator.prototype.validateColor = function(data) {
  return validator.single(data, constraints.color);
}

JsonValidator.prototype.validateEmail = function(data) {
  return validator.single(data, constraints.email);
}

JsonValidator.prototype.validateUnsignInteger = function(data) {
  return validator.single(data, constraints.unsigned_integer);
}

JsonValidator.prototype.validatePercentage = function(data) {
  return validator.single(data, constraints.percentage);
}

JsonValidator.prototype.validateLongtitude = function(data) {
  return validator.single(data, constraints.longtitude);
}

JsonValidator.prototype.validateLatitude = function(data) {
  return validator.single(data, constraints.latitude);
}

JsonValidator.prototype.validatePassword = function(data) {
  return validator.single(data, constraints.password);
}

module.exports = JsonValidator;
