var constant = require("./const.json");
var numReg = /^\d+$/;


var Util = function() {
    Util.prototype.restructureManifestJSON = function(json) {
        return convertNode(json);
    }

    Util.prototype.mappingNode = function(data, mapping) {
        return doMappingNode(data, mapping);
    }

    Util.prototype.mappingArray = function(data, mapping) {
        return doMappingArray(data, mapping);
    }

    Util.prototype.updateAndroidMenu = function(data) {
        return doUpdateAndroidMenu(data);
    }

    Util.prototype.updateIOSMenu = function(data) {
        return doUpdateIOSMenu(data);
    }

    Util.prototype.buildAndroidMenuStructure = function(menuItemArr, searchAffiliateId) {
        return doBuildAndroidMenuStructure(menuItemArr, searchAffiliateId);
    }

    function convertNode(data) {
        var rs = {};
        var key = '';
        var value = '';
        for (var attribute in data) {
            // remove unsuitable attributes
            if (attribute == "__text" || attribute == "toString" ) {
                delete data[attribute];
                continue;
            }

            //do convert
            if (typeof(data[attribute]) != 'object') {
                value = data[attribute];
                if (constant.booleanList.indexOf(attribute) >= 0) {
                     value = value.toLowerCase() == "true" ? true : false;
                } else if (constant.numberList.indexOf(attribute) >= 0){
                    value = parseInt(value);
                }
                rs[attribute] = value;
            } else {
                if (constant.arrayNode.indexOf(attribute) < 0) {
                    rs[attribute] = convertNode(data[attribute]);
                } else  {
                    rs[attribute] = convertArray(data[attribute], attribute);
                }
            }
        }
        return rs;
    };

    function convertArray(data, attribute) {
        var result = [];
        var item = {};

        if (Array.isArray(data)) {
            for (var index = 0; index < data.length; index++) {
                item = data[index];
                result.push(convertNode(item));
            }
            return result;
        } else {
            result.push(convertNode(data));
            return result
        }
    };

    function doMappingNode(data, mapping) {
        var rs = {};
        var key = '';
        var value = '';

        for (var attribute in data) {
            if (typeof(data[attribute]) != "object") {
                key = mapping[attribute];
                value = data[attribute];
                if (key) {
                    if (attribute == "_suppress-ads" && key == 'showAds') {
                        value = !value;
                    }
                    rs[key] = value;
                }
            } else {
                key = mapping[attribute];
                if (key) {
                    if (constant.arrayNode.indexOf(attribute) < 0) {
                        rs[key] = doMappingNode(data[attribute], mapping);
                    } else {
                        if (Array.isArray(data[attribute])) {
                            rs[key] = doMappingArray(data[attribute], mapping);
                        } else {
                            rs[key] = doMappingNode(data[attribute], mapping);
                        }
                    }
                }
            }
        }
        return rs;
    };

    function doMappingArray(data, mapping) {
        var item = {};
        var result = [];

        if (data && data.length >= 1) {
            for (var index = 0; index < data.length; index++) {
                item = data[index];
                result.push(doMappingNode(item, mapping));
            }
            return result;
        } else {
            return null;
        }
    };

    function doUpdateAndroidMenu(menuArr) {
        if (!menuArr || Object.keys(menuArr).length == 0) {
            return null;
        }

        var menuItem =  {};
        for (var i = 0; i < menuArr.length; i ++) {
            menuItem = menuArr[i];
            menuItem = combineFeedForAndroidMenu(menuItem);

            //link
            if (menuItem['webView']) {
                menuItem['type'] = 'link';
                menuItem['typeFamily'] = 'link_type';
                menuItem['feed']= {
                    url: menuItem['webView']['url']
                };

                if (menuItem['targetDisplay'] && (menuItem['targetDisplay'].toLowerCase() == 'internalbrowser')) {
                    menuItem['openInBrowser'] = false;
                } else {
                    menuItem['openInBrowser'] = true;
                }

                //delete unused fields after mapping
                delete menuItem['targetDisplay'];
                delete menuItem['webView'];
            } else if (menuItem.feeds && menuItem.feeds.length > 0) {
                //set type and typeFamily for menuItem
                menuItem['type'] = menuItem['feeds'][0]['type'];
                menuItem['typeFamily'] = menuItem['feeds'][0]['type'] + "_type";

                //category
                if (menuItem['type'] == 'category') {
                    for (var j = 0; j < menuItem.feeds.length; j ++) {
                        var feed = menuItem.feeds[j];
                        premiumUrl = feed["premiumUrl"];
                        if (premiumUrl) {
                            var jdex = premiumUrl.indexOf("?");
                            if (jdex > 0) {
                                premiumUrl = premiumUrl.substring(0, jdex);
                            }
                            feed["premiumUrl"] = premiumUrl;
                        }

                        //delete unused field
                        delete feed["type"];
                        delete feed['captionsUrl'];
                        delete feed['title'];// if exist
                    }
                } else if (menuItem['type'] == 'slideshow') { //slideshow
                    for (var j = 0; j < menuItem.feeds.length; j ++) {
                        var feed = menuItem.feeds[j];

                        if(feed['premiumUrl']) {
                            var premiumUrl = feed["premiumUrl"];
                            if (premiumUrl.indexOf("?") >=0) {
                                feed['premiumUrl'] = premiumUrl.substring(0, premiumUrl.indexOf("?"));
                            }
                        }

                        //delete unused field
                        delete feed['feedType'];
                        delete feed['type'];
                        delete feed['title'];// if exist
                    }
                }
            } else {
                menuItem.type = "feed";
                menuItem.typeFamily = "feed_type";

                // change premiumUrl to url for saving to data base
                if (menuItem['feed'] && menuItem['feed']['premiumUrl']) {
                    menuItem['feed']['url'] = menuItem['feed']['premiumUrl'];
                    delete menuItem['feed']['premiumUrl'];
                }

                //delete unused field
                delete menuItem['feed']["title"];
            }

            //recursive for child menu
            if (menuItem['menu'] && menuItem['menu'].length > 0) {
                doUpdateAndroidMenu(menuItem['menu']);
            }
        }

        return menuArr;
    };


    function doUpdateIOSMenu(menuArr) {
        if (!menuArr || Object.keys(menuArr).length == 0) {
            return null;
        }

        var menuItem =  {};
        for (var i = 0; i < menuArr.length; i ++) {
            menuItem = menuArr[i];
            menuItem = combineFeedForIOSMenu(menuItem);

            //category or slide show
            if (menuItem['feeds'] && menuItem['feeds'].length > 0) {
                //set type and typeFamily for menuItem
                menuItem['type'] = menuItem['feeds'][0]['type'];
                menuItem['typeFamily'] = menuItem['feeds'][0]['type'] + "_type";

                //category
                if (menuItem['type'] == 'category') {
                    for (var j = 0; j < menuItem.feeds.length; j ++) {
                        var feed = menuItem.feeds[j];
                        premiumUrl = feed["premiumUrl"];
                        if (premiumUrl) {
                            var jdex = premiumUrl.indexOf("?");
                            if (jdex > 0) {
                                premiumUrl = premiumUrl.substring(0, jdex);
                            }
                            feed["premiumUrl"] = premiumUrl;
                        }

                        //delete unused field
                        delete feed["type"];
                        delete feed['title'];// if exist
                    }
                } else if (menuItem['type'] == 'slideshow') { //slideshow
                    for (var j = 0; j < menuItem.feeds.length; j ++) {
                        var feed = menuItem.feeds[j];

                        if(feed['premiumUrl']) {
                            var premiumUrl = feed["premiumUrl"];
                            if (premiumUrl.indexOf("?") >=0) {
                                feed['premiumUrl'] = premiumUrl.substring(0, premiumUrl.indexOf("?"));
                            }
                        }

                        //delete unused field
                        delete feed['feedType'];
                        delete feed['type'];
                        delete feed['title'];// if exist
                    }
                }
            }
//             else if (!menuItem['feed']) { check if a section has no feed
//                if (menuItem['layoutType']) {
//                    menuItem['type'] = 'category';
//                    menuItem['typeFamily'] ='category_type'
//                }
//            }
             else {
                 menuItem.type = "feed";
                 menuItem.typeFamily = "feed_type";

                 // change premiumUrl to url for saving to data base
                 if (menuItem['feed'] && menuItem['feed']['premiumUrl']) {
                     menuItem['feed']['url'] = menuItem['feed']['premiumUrl'];

                     //delete unused field
                     delete menuItem['feed']['premiumUrl'];
                     delete menuItem['feed']["title"];
                 }


             }

            //recursive for child menu
            if (menuItem['menu'] && menuItem['menu'].length > 0) {
                doUpdateIOSMenu(menuItem['menu']);
            }
        }

        return menuArr;
    }

    function combineFeedForAndroidMenu(menuItem) {
        if (menuItem['feed'] && menuItem['feed'].length > 0) {
            var feeds = [];
            for (var i = 0; i < menuItem['feed'].length; i++) {
                var feed = menuItem['feed'][i];
                var premiumUrl =  feed['premiumUrl'] ? feed['premiumUrl'] : '';
                var type = 'feed';
                if (feed['feedType'] && (feed['feedType'].toLowerCase() == 'image-slideshow')) {
                    type = 'slideshow';
                } else if (premiumUrl.indexOf("/categories/") > -1) {
                    type = 'category';
                }

				// if type is category or slideshow
                if (type != 'feed') {
                	feed.type = type;
                	feeds.push(feed);
                }
            }

        	if (feeds.length > 0) { //category os slideshow type
        		menuItem['feeds'] = feeds;
        		delete menuItem['feed'];// delete old structure of feed
        	} else {//feed type
        		menuItem['feed'] = menuItem['feed'][0];
        	}
        }
        return menuItem;
    }

    function combineFeedForIOSMenu(menuItem) {
        if (menuItem['feed'] && menuItem['feed'].length > 0) {
            var feeds = [];
            for (var i = 0; i < menuItem['feed'].length; i++) {
                var feed = menuItem['feed'][i];
                var premiumUrl =  feed['premiumUrl'] ? feed['premiumUrl'] : '';
                var type = 'feed';
                if (feed['feedType'] && (feed['feedType'].toLowerCase() == 'image-slideshow')) {
                    type = 'slideshow';
                } else if (premiumUrl.indexOf("/categories/") > -1) {
                    type = 'category';
                }

                // if type is category or slideshow
                if (type != 'feed') {
                    feed.type = type;
                    feeds.push(feed);
                }
            }

            if (feeds.length > 0) { //category os slideshow type
                menuItem['feeds'] = feeds;
                delete menuItem['feed'];// delete old structure of feed
            } else {//feed type
                menuItem['feed'] = menuItem['feed'][0];
            }
        }
        return menuItem;
    }

    function doBuildAndroidMenuStructure(menuItemArr, searchAffiliateId) {
        if (menuItemArr && menuItemArr.length > 0) {
            for (var i = 0; i < menuItemArr.length; i++) {
                var item = menuItemArr[i];
                if (item['feeds'] && item['feeds'].length > 0) {
                    for (var j = 0; j < item['feeds'].length; j++) {
                        var feed = item.feeds[j];
                        if (feed && feed['premiumUrl'] && feed['premiumUrl'].toLowerCase().indexOf("/categories/") >= 0 ) {
                            //parentContentType
                            feed['parentContentType'] = "categories";

                            //childContentType
                            feed['childContentType'] = "stories";
                            if (feed['premiumUrl'].endsWith("clips")) {
                                feed['childContentType'] = "clips";
                            }

                            //parentContentId
                            var parentContentId = feed['premiumUrl'].substring(feed['premiumUrl'].indexOf("/categories/") + "/categories/".length, feed['premiumUrl'].lastIndexOf("/"));
                            feed.parentContentId = -1;
                            if (numReg.test(parentContentId)) {
                                feed['parentContentId'] = parseInt(parentContentId);
                            }

                            //contentPageUrl
                            feed['contentPageUrl'] = '';
                        }

                        if (feed && feed['url'] && feed['url'].toLowerCase().indexOf("/category/") >= 0) {
                            //parentContentType
                            feed.parentContentType = "categories";

                            //childContentType
                            feed['childContentType'] = "stories";
                            if (feed.url.endsWith("clienttype=mrss")) {
                                feed['childContentType'] = "clips";
                            }

                            //contentPageUrl
                            if (feed['url'].indexOf("?") >= 0) {
                                feed['contentPageUrl'] = feed['url'].substring(feed['url'].lastIndexOf("/") + 1, feed['url'].indexOf("?"));
                            }
                        }

                        // start: TEMPORARY CODE FOR BUILD 'SLIDESHOW', waiting for confirmation
                        if (feed && feed['premiumUrl'] && feed['premiumUrl'].toLowerCase().indexOf("/widgets/") >= 0) {
                            //parentContentType
                            feed['parentContentType'] = "widgets";

                            //parentContentId
                            var parentContentId = feed['premiumUrl'].substring(feed['premiumUrl'].indexOf("/widgets/") + "/widgets/".length, feed['premiumUrl'].length);
                            feed['parentContentId'] = -1;
                            if (numReg.test(parentContentId)) {
                                feed['parentContentId'] = parseInt(parentContentId);
                            }

                            feed['contentPageUrl'] = '';
                            feed['childContentType'] = '';
                        }// end

                    }
                }

                //set search affiliateId for category and slideshow
                if ((item['type'] === 'category' || item['type'] === 'slideshow') && !item['searchAffiliateId']) {
                    item.searchAffiliateId = '' + searchAffiliateId;
                }

                //recursive for children menu
                if (item['menu'] && item['menu'].length > 0) {
                    doBuildAndroidMenuStructure(item['menu'], searchAffiliateId)
                }
            }
        }

        return menuItemArr;
    }

}
module.exports = Util;