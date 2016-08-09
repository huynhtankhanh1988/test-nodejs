
/*
 * GET home page.
 */
var ctl = require('../controller/controller');
var fs = require("fs");
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

module.exports.index1 = function(req, res, next){
  ctl.getMenu(req, res);
};

module.exports.index2 = function(req, res, next){
  ctl.searchLink(req, res);
};
