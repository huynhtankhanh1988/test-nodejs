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
var Validator = require('jsonschema').Validator;
/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xmlparser());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var url = require('url');
*/
// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Routes
var v = new Validator();

// Address, to be embedded on Person
  var addressSchema = {
    "id": "/SimpleAddress",
    "type": "object",
    "properties": {
      "lines": {
        "type": "array",
        "items": {"type": "string"}
      },
      "zip": {"type": "string"},
      "city": {"type": "string"},
      "country": {"type": "string"}
    },
    "required": ["country", "city", "zip"]
  };

  // Person
  var schema = {
  //  "id": "/SimplePerson",
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "address": {"$ref": "/SimpleAddress"},
      "votes": {"type": "integer", "minimum": 1}
    }
  };

  var p = {
    "name": "Barack Obama",
    "address": {
      "lines": [ "1600 Pennsylvania Avenue Northwest" ],
      "zip": undefined,
      "city": undefined,
      "country": undefined
    },
    "votes": 1
  };

  v.addSchema(addressSchema, '/SimpleAddress');

  //var result = v.validate(p, schema);
//  console.log(result);

var scheme ={
  "id": "http://jsonschema.net",
  "type": "object",
  "properties": {
    "modules": {
      "id": "http://jsonschema.net/modules",
      "type": "array",
      "items": [
        {
          "id": "http://jsonschema.net/modules/0",
          "type": "object",
          "properties": {
            "breakingNews": {
              "id": "http://jsonschema.net/modules/0/breakingNews",
              "type": "object",
              "properties": {
                "feedUrl": {
                  "type": "number"
                },
                "appVersion": {
                  "type": "string"
                },
                "itemsOnHomePage": {
                  "type": "string"
                },
                "showAds": {
                  "type": "boolean"
                },
                "adTarget": {
                  "type": "string"
                }
              },
              "required": [
                "feedUrl",
                "appVersion",
                "itemsOnHomePage",
                "showAds",
                "adTarget"
              ]
            }
          },
          "required": [
            "breakingNews"
          ]
        },
        {
          "id": "http://jsonschema.net/modules/1",
          "type": "object",
          "properties": {
            "weather": {
              "id": "http://jsonschema.net/modules/1/weather",
              "type": "object",
              "properties": {
                "general": {
                  "id": "http://jsonschema.net/modules/1/weather/general",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "showAds": {
                      "type": "boolean"
                    }
                  }
                },
                "wsi": {
                  "id": "http://jsonschema.net/modules/1/weather/wsi",
                  "type": "object",
                  "properties": {
                    "memberId": {
                      "type": "string"
                    },
                    "serviceId": {
                      "type": "string"
                    },
                    "mapId": {
                      "type": "string"
                    },
                    "sdkKey": {
                      "type": "string"
                    }
                  }
                },
                "severeWeather": {
                  "id": "http://jsonschema.net/modules/1/weather/severeWeather",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "fgColor": {
                      "type": "string"
                    },
                    "bgColor": {
                      "type": "string"
                    }
                  }
                },
                "conditions": {
                  "id": "http://jsonschema.net/modules/1/weather/conditions",
                  "type": "object",
                  "properties": {
                    "basic": {
                      "id": "http://jsonschema.net/modules/1/weather/conditions/basic",
                      "type": "object",
                      "properties": {
                        "enabled": {
                          "type": "boolean"
                        },
                        "fgColor": {
                          "type": "string"
                        },
                        "bgColor": {
                          "type": "string"
                        }
                      }
                    },
                    "detailed": {
                      "id": "http://jsonschema.net/modules/1/weather/conditions/detailed",
                      "type": "object",
                      "properties": {
                        "enabled": {
                          "type": "boolean"
                        },
                        "fgColor": {
                          "type": "string"
                        },
                        "bgColor": {
                          "type": "string"
                        },
                        "conditions": {
                          "type": "string"
                        }
                      }
                    },
                    "sunMoon": {
                      "id": "http://jsonschema.net/modules/1/weather/conditions/sunMoon",
                      "type": "object",
                      "properties": {
                        "enabled": {
                          "type": "boolean"
                        },
                        "fgColor": {
                          "type": "string"
                        },
                        "bgColor": {
                          "type": "string"
                        }
                      }
                    }
                  }
                },
                "textForecast": {
                  "id": "http://jsonschema.net/modules/1/weather/textForecast",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "feedUrl": {
                      "type": "string"
                    },
                    "fgColor": {
                      "type": "string"
                    },
                    "bgColor": {
                      "type": "string"
                    }
                  }
                },
                "dailyForecast": {
                  "id": "http://jsonschema.net/modules/1/weather/dailyForecast",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "feedUrl": {
                      "type": "string"
                    },
                    "fgColor": {
                      "type": "string"
                    },
                    "bgColor": {
                      "type": "string"
                    }
                  }
                },
                "hourlyForecast": {
                  "id": "http://jsonschema.net/modules/1/weather/hourlyForecast",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "feedUrl": {
                      "type": "string"
                    },
                    "fgColor": {
                      "type": "string"
                    },
                    "bgColor": {
                      "type": "string"
                    }
                  }
                },
                "videoForecast": {
                  "id": "http://jsonschema.net/modules/1/weather/videoForecast",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "feedUrl": {
                      "type": "string"
                    },
                    "fgColor": {
                      "type": "string"
                    },
                    "bgColor": {
                      "type": "string"
                    }
                  }
                },
                "interactiveRadar": {
                  "id": "http://jsonschema.net/modules/1/weather/interactiveRadar",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "fgColor": {
                      "type": "string"
                    },
                    "bgColor": {
                      "type": "string"
                    }
                  }
                },
                "weatherNews": {
                  "id": "http://jsonschema.net/modules/1/weather/weatherNews",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "feedUrl": {
                      "type": "string"
                    },
                    "fgColor": {
                      "type": "string"
                    },
                    "bgColor": {
                      "type": "string"
                    }
                  }
                },
                "weatherImages": {
                  "id": "http://jsonschema.net/modules/1/weather/weatherImages",
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean"
                    },
                    "feedUrl": {
                      "type": "string"
                    },
                    "fgColor": {
                      "type": "string"
                    },
                    "bgColor": {
                      "type": "string"
                    }
                  }
                },
                "additionalOptions": {
                  "id": "http://jsonschema.net/modules/1/weather/additionalOptions",
                  "type": "object",
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
                  "id": "http://jsonschema.net/modules/1/weather/weatherLocations",
                  "type": "array",
                  "items": {
                    "id": "http://jsonschema.net/modules/1/weather/weatherLocations/0",
                    "type": "object",
                    "properties": {
                      "name": {"type": "string"},
                      "code": {
                        "type": "string"
                      },
                      "zipCode": {
                        "type": "string"
                      },
                      "latitude": {
                        "type": "string"
                      },
                      "longitude": {
                        "type": "string"
                      },
                      "altitude": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          "id": "http://jsonschema.net/modules/2",
          "type": "object",
          "properties": {
            "traffic": {
              "id": "http://jsonschema.net/modules/2/traffic",
              "type": "object",
              "properties": {
                "enabled": {
                  "type": "boolean"
                },
                "defaultCenterLat": {
                  "type": "string"
                },
                "defaultCenterLong": {
                  "type": "string"
                },
                "defaultAltitude": {
                  "type": "string"
                },
                "defaultOverlays": {
                  "type": "string"
                },
                "defaultLayer": {
                  "type": "string"
                }
              }
            }
          }
        }
      ],
      "required": [
        "0",
        "1",
        "2"
      ]
    }
  },
  "required": [
    "modules"
  ]
}

var data = {
  "modules": [
    {
      "breakingNews": {
        "feedUrl": "",
        "appVersion": "list",
        "itemsOnHomePage": "",
        "showAds": true,
        "adTarget": ""
      }
    },
    {
      "weather": {
        "general": {
          "enabled": true,
          "showAds": true
        },
        "wsi": {
          "memberId": "",
          "serviceId": "",
          "mapId": "",
          "sdkKey": ""
        },
        "severeWeather": {
          "enabled": true,
          "fgColor": "",
          "bgColor": ""
        },
        "conditions": {
          "basic": {
            "enabled": true,
            "fgColor": "",
            "bgColor": ""
          },
          "detailed": {
            "enabled": true,
            "fgColor": "",
            "bgColor": "",
            "conditions": "Feels Like, Humidity, Wind Speed, Pressure"
          },
          "sunMoon": {
            "enabled": true,
            "fgColor": "",
            "bgColor": ""
          }
        },
        "textForecast": {
          "enabled": true,
          "feedUrl": "",
          "fgColor": "",
          "bgColor": ""
        },
        "dailyForecast": {
          "enabled": true,
          "feedUrl": "",
          "fgColor": "",
          "bgColor": ""
        },
        "hourlyForecast": {
          "enabled": true,
          "feedUrl": "",
          "fgColor": "",
          "bgColor": ""
        },
        "videoForecast": {
          "enabled": true,
          "feedUrl": "",
          "fgColor": "",
          "bgColor": ""
        },
        "interactiveRadar": {
          "enabled": true,
          "fgColor": "",
          "bgColor": ""
        },
        "weatherNews": {
          "enabled": true,
          "feedUrl": "",
          "fgColor": "",
          "bgColor": ""
        },
        "weatherImages": {
          "enabled": true,
          "feedUrl": "",
          "fgColor": "",
          "bgColor": ""
        },
        "additionalOptions": {
          "disableWeatherLinkInBranding": false,
          "hideHilo": false
        },
        "weatherLocations": [
          {
            "name": "",
            "code": "",
            "zipCode": "",
            "latitude": "",
            "longitude": "",
            "altitude": "20000"
          }
        ]
      }
    },
    {
      "traffic": {
        "enabled": true,
        "defaultCenterLat": "",
        "defaultCenterLong": "",
        "defaultAltitude": "55000",
        "defaultOverlays": "TrafficIncidents,TrafficFlows",
        "defaultLayer": "Radar"
      }
    }
  ]
}

console.log(v.validate(data, scheme));

app.get('/menu/:id', routes.index1);
app.post('/links/search', routes.index2);

app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});
