
var express = require('express');
var app = module.exports = express();
var https = require('https');

var options = {
  host: 'cms.ddev1.worldnow.com',
  path: '/v1.0/menu/6',
  method: 'GET',
   headers: {
     'Authorization': 'struong~worldnow113~6',
     'Content-Type': 'application/xml',
     'access-control-allow-origin': '*'
   }
};

// do the GET request
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var reqGet = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});

//
//
//var menuItems = [
//	{
//  	"title": "menu 1",
//    "level": 0,
//    "order": 1
//    "menu": [
//    	{
//        "title": "menu 1.1",
//        "level": 1,
//        "order": 1,
//        "menu": []
//      }
//    ]
//  }
//];
//
//function removeMenuItemHasLevelGt2(menuItemArr) {
//  if (menuItemArr && menuItemArr.length > 0) {
//    for (let i = 0; i < menuItemArr.length; i++) {
//      if (menuItemArr[i]['level'] == 1 && menuItemArr[i]['menu']) {
//        delete menuItemArr[i]['menu'];
//      }
//    }
//  }
//  return menuItemArr;
//}
//
//var a = removeMenuItemHasLevelGt2(menuItems);
//console.log(JSON.stringify(a));


function removePageMenu(menuArray) {
  if (menuArray && menuArray.length > 0) {
    for (var i = 0; i < menuArray.length; i++) {
      var menuItem = menuArray[i];
      if (menuItem['type'] && menuItem['type'] === 'page') {
        menuArray.splice(i, 1);
      }
      // do recursive for child menu
      if (menuItem['menu'] && menuItem['menu'].length > 0) {
        removePageMenu(menuArray[i]['menu']);
      }
    }
  }
  return menuArray;
}

var menu = [{
  "title": "menu 1",
  "type": "category",
  "menu": [{
    "title": "menu 3",
    "type": "page"
  }]
}, {
  "title": "menu 2",
  "type": "page"
}, ]

var result = removePageMenu(menu);
console.log(JSON.stringify(result, null, 2));


app.listen(6000, function(){

  console.log("Express server listening on port %d in %s mode", 6000, app.settings.env);
});
