/**
 * Module dependencies.
 */

var express = require('express')
var routes = require('./routes');
var https = require('https');
var request = require('request');
var fs = require("fs");
var bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
var ctl = require('./controller/controller');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-d

var app = module.exports = express();
var js2xmlparser = require("js2xmlparser");
var validate = require("validate.js");
var morgan = require( 'morgan' );

morgan.token('time', function(req, res){ return req.headers['content-type']; })

var morganOption = '[:date[clf]] - :method :url :status';

// setup logger
//app.use( morgan( 'combined' ) );
app.use( morgan(morganOption));


// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// Routes

app.get('/testMorgan', function(request, response){
    console.trace(response);

    response.json({hello: "hello"});
});

app.listen(9000, function() {
  console.log("Express server listening on port 9000");
});
