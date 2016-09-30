var express = require('express')
var routes = require('./routes');
var https = require('https');
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

var contentful = require('contentful')
var util = require('util')
var client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: 'developer_bookshelf',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: '0b7f6x59a0'
});

// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
client.getContentType('book')
.then(function (entry) {
  console.log(util.inspect(entry, {depth: null}))
})



// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.listen(9000, function() {
  console.log("Express server listening on port 9000");
});
