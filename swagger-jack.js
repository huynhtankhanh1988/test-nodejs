// Load module dependencies.
var express = require("express")
 , url = require("url")
 , swagger = require("swagger-node-express");
 var bodyParser = require('body-parser');
 var petData = require('swagger-converter');

// Create the application.
var app = express();
app.use(bodyParser.urlencoded({	extended: false	}));
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());

// Couple the application to the Swagger module.
swagger.setAppHandler(app);
swagger.addValidator(
  function validate(req, path, httpMethod) {
    //  example, only allow POST for api_key="special-key"
    if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
      var apiKey = req.headers["api_key"];
      if (!apiKey) {
        apiKey = url.parse(req.url,true).query["api_key"];
      }
      if ("special-key" == apiKey) {
        return true;
      }
      return false;
    }
    return true;
  }
);

// swagger.addModels(models);

var findById = {
  'spec': {
    "description" : "Operations about pets",
    "path" : "/pet/{petId}",
    "notes" : "Returns a pet based on ID",
    "summary" : "Find pet by ID",
    "method": "GET",
    "parameters" : [swagger.pathParam("petId", "ID of pet that needs to be fetched", "string")],
    "type" : "Pet",
    "errorResponses" : [swagger.errors.invalid('id'), swagger.errors.notFound('pet')],
    "nickname" : "getPetById"
  },
  'action': function (req,res) {
    console.log("----- " + req.params.petId);
    if (!req.params.petId) {
      throw swagger.errors.invalid('id');
    }
    var id = parseInt(req.params.petId);
    // var pet = petData.getPetById(id);
    var pet = {
  "id": 1,
  "name": "a",
  "photoUrls": [],
  "tags": [],
  "status": "available"
}

    if (pet) {
      res.send(JSON.stringify(pet));
    } else {
      throw swagger.errors.notFound('pet');
    }
  }
};

swagger.addGet(findById);

app.get('/', function(req, res) {
  res.end('hello');
});

swagger.configure("http://petstore.swagger.wordnik.com", "0.1");

app.listen(8088, function(){
  console.log("Server listening on port 8088");
});
