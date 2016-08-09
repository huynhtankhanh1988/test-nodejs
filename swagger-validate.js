// Load module dependencies.
var express = require("express")
 , url = require("url")
 , swagger = require("swagger-node-express");
 var bodyParser = require('body-parser');
 var petData = require('swagger-converter');
 var swaggerValidate = require('swagger-validate')

// Create the application.
var app = express();
app.use(bodyParser.urlencoded({	extended: false	}));
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());

var catModel = {
    id: 'Cat',
    required: ['name'],
    properties: {
      name: { type: 'number', maximum: 100 },
      age: { type: 'string', "pattern": "^/dev/[^/]+(/[^/]+)*$"}
    }
};

var myCat = {
    name: 90,
    age: "sdsdfsdfdsfsd"
};

var error = swaggerValidate.model(myCat, catModel);

console.log(error);
// console.error(error.toString());

app.listen(9999, function(){
  console.log("Server listening on port 9999");
});
