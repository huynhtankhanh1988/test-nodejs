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

    console.log(moment().subtract(10, 'days').calendar());

		request
		  .get('http://localhost:8081/classes/ItemConfig')
		  .set('Accept', 'application/json')
		  .set('X-Parse-Application-Id', 'wPJuyJsloZ14Rx7rUIk1BLLlpmrVt7rHqD5w3iza')
		  .set('X-Parse-Master-Key', 'MASTER_KEY')
		  .set('Content-Type', 'application/json')
		  .end(function(error, data) {
			if (error) {
			  console.log(error);
			} else {
			  var ddd = data.body.results;
			  if (ddd && ddd.length > 0) {
			    var item = {};
			    for (var i = 0; i < ddd.length; i++) {
			        if (ddd[i]['xmlUrl']) {
			            item = ddd[i];
//			            console.log(ddd[i]);
			            break;
			        }
 			    }
 			    //
 			    request
 			        .get(item['xmlUrl'])
// 			        .set('Accept', 'application/xml')
// 			        .set('X-Parse-Application-Id', 'wPJuyJsloZ14Rx7rUIk1BLLlpmrVt7rHqD5w3iza')
//                    .set('X-Parse-Master-Key', 'MASTER_KEY')
                    .end(function(err, result){
                        if (err) {
                            console.log("get file error: ");
                        } else {
                            console.log(result.body);
                        }
                    })
 			    //
			  }
			}
		  });




app.listen(4000, function(){
  console.log("Express server listening on port 4000");
});
