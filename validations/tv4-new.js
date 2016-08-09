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
var appC = require('./api-constraints.json');
var winston = require('winston');
var path = require('path');

var options1 = {
    level: 'error',
    json: true,
    prettyPrint: true,
    showLevel: false,
    colorize: "all",
    filename: path.resolve(__dirname, 'somefile.html'),
    zippedArchive: true
}

//winston.remove(winston.transports.File);
winston.add(winston.transports.File, options1);
//winston.add(winston.transports.File, { filename: path.resolve(__dirname, 'somefile.log') });


tv4.setErrorReporter(function (error, data, schema) {
  // console.log(error);
    console.log("................................");
  if(schema.validationMessage){
    // console.log(schema.validationMessage[error.code])
    if(schema.validationMessage[error.code]) {
      return schema.validationMessage[error.code];
    }
    return schema.validationMessage["default"];
  }
});

var data = {
                 "objectId": "5zwl6rE9HJ",
                 "general": {
                   "affiliateName": "",
                   "affiliateId": "0",
                   "availableApps": [
                     "iOS",
                     "Android",
                     "Roku",
                     "Apple TV",
                     "Fire TV"
                   ],
                   "cmsCustomer": true,
                   "isAllowsEnableApp": true
                 },
                 "premiumFeeds": {
                   "apiKey": "",
                   "contextAffiliateId": ""
                 },
                 "search": {
                   "baseUrl": "http://sitesearch.worldnow.com/search",
                   "affiliateIds": "",
                   "resultCount": "50"
                 },
                 "pushBehavior": {
                   "enabled": false,
                   "defaultProvider": "parse",
                   "parse": {
                     "appId": "",
                     "appKey": ""
                   },
                   "urbanAirship": {
                     "appId": "",
                     "appKey": "",
                     "showInbox": false,
                     "productionAppSecret": ""
                   },
                   "channels": []
                 },
                 "analytics": {
                   "googleAnalyticsId": ""
                 },
                 "advertising": {
                   "bannerEnabled": true,
                   "network": "DFP",
                   "networkKey": "",
                   "autoHideBanner": true,
                   "inlineRefresh": "60",
                   "inlineLocation": "3",
                   "inlineEnabled": true,
                   "video": {
                     "VASTUrl": "",
                     "enabled": false,
                     "randomNumberParameter": "&amp;correlator="
                   },
                   "interstitialAds": {
                     "enabled": false,
                     "adServer": "DFP",
                     "adUnitId": "",
                     "minTimeBetweenAds": 12000,
                     "interstitialAdSplashEnabled": false,
                     "interstitialAdFrequency": 1,
                     "interstitialAdSplashFrequency": 1
                   },
                   "recommendation": {
                     "outbrain": {
                       "enabled": false,
                       "partnerId": "",
                       "outbrainWidgetId": ""
                     }
                   }
                 },
                 "breakingNews": {
                   "feedUrl": "",
                   "itemsOnHomePage": "",
                   "showAds": true,
                   "adTarget": ""
                 },
                 "video": {
                   "closedCaptionUrl": "",
                   "liveVideoUrl": ""
                 },
                 "weather": {
                   "general": {
                     "enabled": false,
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
                     "feedUrl": "",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "dailyForecast": {
                     "enabled": true,
                     "feedUrl": "",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "hourlyForecast": {
                     "enabled": true,
                     "feedUrl": "",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "videoForecast": {
                     "enabled": true,
                     "feedUrl": "",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "interactiveRadar": {
                     "enabled": true,
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "weatherNews": {
                     "enabled": true,
                     "feedUrl": "",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "weatherImages": {
                     "enabled": true,
                     "feedUrl": "",
                     "fgColor": "#ffffff",
                     "bgColor": "#303030"
                   },
                   "additionalOptions": {
                     "disableWeatherLinkInBranding": true,
                     "hideHilo": false
                   },
                   "weatherLocations": []
                 },
                 "connect": {
                   "newsTipEmail": "",
                   "sharePhotoEmail": "",
                   "bugReportEmail": "news-app-support@franklyinc.com",
                   "callUsPhone": "",
                   "aboutUsUrl": "",
                   "privacyPolicyUrl": "",
                   "tosUrl": "",
                   "facebook": {
                     "facebookAppId": "",
                     "facebookSecret": "",
                     "facebookUsername": ""
                   },
                   "twitterhandle": "",
                   "instagramUsername": "",
                   "blogUrl": "",
                   "secondaryBlogUrl": "",
                   "ugcUrl": ""
                 },
                 "storeAccounts": {
                   "apple": {
                     "userId": "",
                     "password": ""
                   },
                   "googlePlay": {
                     "userId": "",
                     "password": ""
                   },
                   "roku": {
                     "userId": "",
                     "password": ""
                   },
                   "amazon": {
                     "userId": "",
                     "password": ""
                   }
                 },
                 "affiliateId": "0",
                 "updatedAt": "2016-05-11T02:11:23.971Z",
                 "createdAt": "2016-04-19T09:00:10.561Z",
                 "traffic": {
                   "enabled": true,
                   "defaultCenterLat": "",
                   "defaultCenterLong": "",
                   "defaultAltitude": "55000",
                   "defaultOverlays": "TrafficIncidents,TrafficFlows",
                   "defaultLayer": "Radar"
                 }
               }


/**
  Modify empty fields to null
*/
function modifyEmptyFields(json) {
  for (var att in json) {
    if (isEmpty(json[att])) {
      if (typeof(json[att]) != 'object') {
         json[att] = null;
      }
    } else {
      var child = json[att];
      if (typeof(child) == 'object') {
        if (Array.isArray(child)) {
          for (var i = 0; i < child.length; i ++) {
            modifyEmptyFields(child[i]);
          }
        } else {
          modifyEmptyFields(child);
        }
      }
    }
  }
  return json;
}

function isEmpty(obj) {

  if (typeof(obj) === 'boolean' || typeof(obj) === 'number') {
    return false;
  }

  if (!obj) {
    return true;
  }

  if (Array.isArray(obj)) {
    return obj.length == 0 ? true : false;
  }

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }

  return true && JSON.stringify(obj) === JSON.stringify({});
}

//winston.log('error', 'Hello again distributed logs');
var dataAfter = modifyEmptyFields(data);
//console.log(JSON.stringify(dataAfter, null, 2));
//winston.log('error', JSON.stringify(dataAfter, null, 2));
var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var i;
function aaa(test) {
    var filePath = path.resolve(__dirname, '..', 'association.xml');
//     console.log(filePath);
    fs.readFile(__dirname + '/../association.xml', function(err, data) {
        parser.parseString(data, function (err, result) {
//            console.log("error>>" + err);
//            console.log("result>>" + JSON.stringify(result, null, 2));
//            console.log('Done');
       test(result);
//    return result;
        });
    });
}

 aaa(test);
// console.log(i);
 function test(i1){
    i = i1;

 }
 setTimeout(function(){  console.log(i)}, 3000);


/////////////////////////////////////////////
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.listen(6000, function() {
  console.log("Express server listening on port 6000");
});