/**
 * Module dependencies.
 */

var express = require('express');
var https = require('https');
var request = require('request');
var fs = require("fs");
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var app = module.exports = express();
var tv4 = require('tv4');

var commonSchema =  {
                       "type": "object",
                       "additionalProperties": false,
                       "properties": {
                         "general": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "showAds": {
                               "type": "boolean"
                             },
                             "adTarget":{
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 255
                             }
                           }
                         },
                         "wsi": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "memberId": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 255
                             },
                             "serviceId": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 255
                             },
                             "mapId": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 255
                             },
                             "sdkKey": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 255
                             }
                           }
                         },
                         "severeWeather": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "fgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "bgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             }
                           }
                         },
                         "conditions": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "basic": {
                               "type": "object",
                               "additionalProperties": false,
                               "properties": {
                                 "enabled": {
                                   "type": "boolean"
                                 },
                                 "fgColor": {
                                   "type": [
                                     "string",
                                     "null"
                                   ],
                                   "pattern": "^#[A-Fa-f0-9]{6}$",
                                   "errorMessage": {
                                     "202": "Invalid hex color."
                                   }
                                 },
                                 "bgColor": {
                                   "type": [
                                     "string",
                                     "null"
                                   ],
                                   "pattern": "^#[A-Fa-f0-9]{6}$",
                                   "errorMessage": {
                                     "202": "Invalid hex color."
                                   }
                                 }
                               }
                             },
                             "detailed": {
                               "type": "object",
                               "additionalProperties": false,
                               "properties": {
                                 "enabled": {
                                   "type": "boolean"
                                 },
                                 "fgColor": {
                                   "type": [
                                     "string",
                                     "null"
                                   ],
                                   "pattern": "^#[A-Fa-f0-9]{6}$",
                                   "errorMessage": {
                                     "202": "Invalid hex color."
                                   }
                                 },
                                 "bgColor": {
                                   "type": [
                                     "string",
                                     "null"
                                   ],
                                   "pattern": "^#[A-Fa-f0-9]{6}$",
                                   "errorMessage": {
                                     "202": "Invalid hex color."
                                   }
                                 },
                                 "conditions": {
                                   "type": [
                                     "string",
                                     "null"
                                   ],
                                   "maxLength": 255
                                 }
                               }
                             },
                             "sunMoon": {
                               "type": "object",
                               "additionalProperties": false,
                               "properties": {
                                 "enabled": {
                                   "type": "boolean"
                                 },
                                 "fgColor": {
                                   "type": [
                                     "string",
                                     "null"
                                   ],
                                   "pattern": "^#[A-Fa-f0-9]{6}$",
                                   "errorMessage": {
                                     "202": "Invalid hex color."
                                   }
                                 },
                                 "bgColor": {
                                   "type": [
                                     "string",
                                     "null"
                                   ],
                                   "pattern": "^#[A-Fa-f0-9]{6}$",
                                   "errorMessage": {
                                     "202": "Invalid hex color."
                                   }
                                 }
                               }
                             }
                           }
                         },
                         "textForecast": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "feedUrl": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 2048,
                               "pattern": "/^(https?|ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i",
                               "errorMessage": {
                                 "202": "You must enter a valid link."
                               }
                             },
                             "fgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "bgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             }
                           }
                         },
                         "dailyForecast": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "feedUrl": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 2048,
                               "pattern": "/^(https?|ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i",
                               "errorMessage": {
                                 "202": "You must enter a valid link."
                               }
                             },
                             "fgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "bgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             }
                           }
                         },
                         "hourlyForecast": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "feedUrl": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 2048,
                               "pattern": "/^(https?|ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i",
                               "errorMessage": {
                                 "202": "You must enter a valid link."
                               }
                             },
                             "fgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "bgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             }
                           }
                         },
                         "videoForecast": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "feedUrl": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 2048,
                               "pattern": "/^(https?|ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i",
                               "errorMessage": {
                                 "202": "You must enter a valid link."
                               }
                             },
                             "fgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "bgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             }
                           }
                         },
                         "interactiveRadar": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "fgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "bgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "showAds": {
                               "type": "boolean"
                             },
                             "layer": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 255
                             }
                           }
                         },
                         "weatherNews": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "feedUrl": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 2048,
                               "pattern": "/^(https?|ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i",
                               "errorMessage": {
                                 "202": "You must enter a valid link."
                               }
                             },
                             "fgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "bgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             }
                           }
                         },
                         "weatherImages": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "enabled": {
                               "type": "boolean"
                             },
                             "feedUrl": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "maxLength": 2048,
                               "pattern": "/^(https?|ftp):\\/\\/(((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i",
                               "errorMessage": {
                                 "202": "You must enter a valid link."
                               }
                             },
                             "fgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             },
                             "bgColor": {
                               "type": [
                                 "string",
                                 "null"
                               ],
                               "pattern": "^#[A-Fa-f0-9]{6}$",
                               "errorMessage": {
                                 "202": "Invalid hex color."
                               }
                             }
                           }
                         },
                         "additionalOptions": {
                           "type": "object",
                           "additionalProperties": false,
                           "properties": {
                             "disableWeatherLinkInBranding": {
                               "type": "boolean"
                             },
                             "hideHilo": {
                               "type": "boolean"
                             }
                           }
                         },
                         "weatherLocations": {
                           "type": "array",
                           "items": {
                             "type": "object",
                             "additionalProperties": false,
                             "required": [
                               "name",
                               "code",
                               "zipCode",
                               "latitude",
                               "longitude",
                               "altitude",
                               "isDefault"
                             ],
                             "properties": {
                               "name": {
                                 "type": "string",
                                 "maxLength": 255
                               },
                               "code": {
                                 "type": "string",
                                 "maxLength": 255
                               },
                               "zipCode": {
                                 "type": [
                                   "string",
                                   "number"
                                 ],
                                 "maxLength": 10,
                                 "pattern": "^(-|\\+)?\\d+\\.?\\d*$",
                                 "errorMessage": {
                                   "202": "Invalid altitude."
                                 }
                               },
                               "latitude": {
                                 "type": [
                                   "string",
                                   "number"
                                 ],
                                 "pattern": "^(\\+|-)?(?:90(?:(?:\\.0{1,10})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,10})?))$",
                                 "errorMessage": {
                                   "202": "Invalid latitude."
                                 }
                               },
                               "longitude": {
                                 "type": [
                                   "string",
                                   "number"
                                 ],
                                 "pattern": "^(\\+|-)?(?:180(?:(?:\\.0{1,10})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,10})?))$",
                                 "errorMessage": {
                                   "202": "Invalid longitude"
                                 }
                               },
                               "altitude": {
                                 "type": [
                                   "string",
                                   "number"
                                 ],
                                 "maxLength": 10,
                                 "pattern": "^(-|\\+)?\\d+\\.?\\d*$",
                                 "errorMessage": {
                                   "202": "Invalid altitude."
                                 }
                               },
                               "isDefault": {
                                 "type": "boolean"
                               }
                             }
                           }
                         },
                         "weatherLayout": {
                           "type": "array",
                           "items": {
                             "type": "object",
                             "additionalProperties": false,
                             "properties": {
                               "type": {
                                 "type": "string"
                               },
                               "label": {
                                 "type": "string"
                               }
                             }
                           }
                         }
                       }
                     };

var data =  {
                   "general": {
                     "enabled": false,
                     "showAds": true,
                     "adTarget": "weather"
                   },
                   "wsi": {
                     "memberId": "",
                     "serviceId": "",
                     "mapId": "",
                     "sdkKey": ""
                   },
                   "severeWeather": {
                     "enabled": true,
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "conditions": {
                     "basic": {
                       "enabled": true,
                       "fgColor": "#ffffff",
                       "bgColor": "#303030"
                     },
                     "detailed": {
                       "enabled": true,
                       "fgColor": "#ffffff",
                       "bgColor": "#303030",
                       "conditions": "Feels Like, Humidity, Wind Speed, Pressure"
                     },
                     "sunMoon": {
                       "enabled": true,
                       "fgColor": "#ffffff",
                       "bgColor": "#303030"
                     }
                   },
                   "textForecast": {
                     "enabled": true,
                     "feedUrl": "http://google.com.vn",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "dailyForecast": {
                     "enabled": true,
                     "feedUrl": "http://google.com.vn",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "hourlyForecast": {
                     "enabled": true,
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "videoForecast": {
                     "enabled": true,
                     "feedUrl": "http://google.com.vn",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "interactiveRadar": {
                     "enabled": true,
                     "fgColor": "#ffffff",
                     "bgColor": "#303030",
                     "showAds": true,
                     "layer": "Radar (Precipitation)"
                   },
                   "weatherNews": {
                     "enabled": true,
                     "feedUrl": "http://google.com.vn",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "weatherImages": {
                     "enabled": true,
                     "feedUrl": "http://google.com.vn",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "weatherLocations": [
                             {
                               "name": "hcm",
                               "code": "08",
                               "zipCode": "08",
                               "latitude": "22.25",
                               "longitude": "25.25",
                               "altitude": "20000",
                               "isDefault": true
                             },
                              {
                                "name": "hcm1",
                                "code": "08",
                                "zipCode": null,
                                "latitude": "212.25",
                                "longitude": "215.25",
                                "altitude": "20000",
                                "isDefault": true
                              },
                   ],
                   "weatherLayout": [
                     {
                       "type": "basic",
                       "label": "Basic Conditions"
                     },
                     {
                       "type": "detailed",
                       "label": "Detailed Readings"
                     },
                     {
                       "type": "hourlyForecast",
                       "label": "Hourly Forecast"
                     },
                     {
                       "type": "radar",
                       "label": "Radar"
                     },
                     {
                       "type": "sunMoon",
                       "label": "Sun and Moon"
                     },
                     {
                       "type": "videoForecast",
                       "label": "Video Forecast"
                     },
                     {
                       "type": "dailyForecast",
                       "label": "Daily Forecast"
                     },
                     {
                       "type": "textForecast",
                       "label": "Text Forecast"
                     },
                     {
                       "type": "weatherImages",
                       "label": "Weather Images"
                     },
                     {
                       "type": "weatherNews",
                       "label": "Weather News"
                     }
                   ]
                 };


var result = tv4.validateMultiple(data, commonSchema);
console.log(customizeErrors(result.errors));


var schema1 = {
                                         "type": "array",
                                         "items": {
                                           "type": "object",
                                           "additionalProperties": false,
                                           "required": [
                                             "name",
                                             "code",
                                             "zipCode",
                                             "latitude",
                                             "longitude",
                                             "altitude",
                                             "isDefault"
                                           ],
                                           "properties": {
                                             "name": {
                                               "type": "string",
                                               "maxLength": 255
                                             },
                                             "code": {
                                               "type": "string",
                                               "maxLength": 255
                                             },
                                             "zipCode": {
                                               "type": [
                                                 "string",
                                                 "number"
                                               ],
                                               "maxLength": 10,
                                               "pattern": "^(-|\\+)?\\d+\\.?\\d*$",
                                               "errorMessage": {
                                                 "202": "Invalid altitude."
                                               }
                                             },
                                             "latitude": {
                                               "type": [
                                                 "string",
                                                 "number"
                                               ],
                                               "pattern": "^(\\+|-)?(?:90(?:(?:\\.0{1,10})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,10})?))$",
                                               "errorMessage": {
                                                 "202": "Invalid latitude."
                                               }
                                             },
                                             "longitude": {
                                               "type": [
                                                 "string",
                                                 "number"
                                               ],
                                               "pattern": "^(\\+|-)?(?:180(?:(?:\\.0{1,10})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,10})?))$",
                                               "errorMessage": {
                                                 "202": "Invalid longitude"
                                               }
                                             },
                                             "altitude": {
                                               "type": [
                                                 "string",
                                                 "number"
                                               ],
                                               "maxLength": 10,
                                               "pattern": "^(-|\\+)?\\d+\\.?\\d*$",
                                               "errorMessage": {
                                                 "202": "Invalid altitude."
                                               }
                                             },
                                             "isDefault": {
                                               "type": "boolean"
                                             }
                                           }
                                         }
                                       }

 var data1 = [
                                          {
                                            "name": "hcm",
                                            "code": "08",
                                            "zipCode": "08",
                                            "latitude": "22.25",
                                            "longitude": "25.25",
                                            "altitude": "20000",
                                            "isDefault": true
                                          },
                                           {
                                             "name": "hcm1",
                                             "code": "08",
                                             "zipCode": null,
                                             "latitude": "212.25",
                                             "longitude": "215.25",
                                             "altitude": "20000",
                                             "isDefault": true
                                           },
                                ]

 console.log('============================');
         var result = tv4.validateMultiple(data1, schema1);
         console.log(customizeErrors(result.errors));

function customizeErrors(jsonError) {
  for (var i = 0; i < jsonError.length; i ++) {
    var dataPath = jsonError[i]["dataPath"];
    dataPath = dataPath.substring(1, dataPath.length).replace(/[/]/g, '.');
    jsonError[i]["dataPath"] = dataPath;
    delete jsonError[i]["params"];
    delete jsonError[i]["schemaPath"];
    delete jsonError[i]["subErrors"];
    delete jsonError[i]["stack"];
  }
  return jsonError;
}

/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
