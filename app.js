/**
 * Module dependencies.
 */

  var express = require('express')
  var routes = require('./routes');
  var https = require('https');
//  var request = require('request');
  var fs = require("fs");
  var bodyParser = require('body-parser');
  var xmlparser = require('express-xml-bodyparser');
  var ctl = require('./controller/controller');
  var multer = require('multer'); // v1.0.5
  var upload = multer();
  var app = module.exports = express();
  var js2xmlparser = require("js2xmlparser");
  var moment = require('moment');
  var now = moment();
  var request = require('superagent');

  // this week
    var thisWeekStart = moment(now).subtract(1, 'day').day(0).format('YYYY-MM-DD');
    var thisWeekEnd = moment(now).format('YYYY-MM-DD');
    console.log("thisWeekStart " + thisWeekStart);
    console.log("thisWeekEnd " + thisWeekEnd);

    // last week
    var lastWeekStart = moment(now).subtract(1, 'day').day(0).subtract(1, 'week')
                                  .format('YYYY-MM-DD');
    var lastWeekEnd = moment(now).subtract(1, 'day').day(6).subtract(1, 'week')
                                .format('YYYY-MM-DD');
    console.log("lastWeekStart " + lastWeekStart);
    console.log("lastWeekEnd " + lastWeekEnd);

//    console.log(moment().subtract(10, 'days').calendar());
//
//    var pd = require('pretty-data2').pd;
//
//    var data = '<root><fname>dfdfgdf00</fname><lname>dsfsdfs</lname></root>';
//    var a = pd.xml(data);
//    console.log(a);


    var a = moment("20111031", "YYYYMMDD").format('ll');
    console.log(a);



app.listen(4000, function(){
  console.log("Express server listening on port 4000");
});
