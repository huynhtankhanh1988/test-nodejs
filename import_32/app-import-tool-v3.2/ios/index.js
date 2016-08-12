var constant = require("./const.json");
var mapping = require("./mapping.json");
var Util = require('../util');
var util = new Util();
var _captionUrl = '';

var IOSConverter = function() {
    IOSConverter.prototype.combineItemConfig = function(preJson) {
        return doCombineItemConfig(preJson);
    }

    function doCombineItemConfig(preJson) {
        try {
            var itemConfig = {};
            var setting = {};

            //THEME
            var theme = {};
            theme = combineStyle(preJson['brandCustomization']);

            //SETTING
            //search
            var search = {};
            search = combineSearch(preJson['frn-search']);
            setting['search'] = search;

            // pushBehavior
            var pushBehavior = {};
            if (preJson['pushBehavior']) {
                pushBehavior = combinePushBehavior(preJson['pushBehavior']);
            } else {
                pushBehavior['enabled'] = false;
            }
            setting['pushBehavior'] = pushBehavior;

            //analytics
            var analytics = {};
            analytics = combineReportingBehavior(preJson['reportingBehavior']);
            setting['analytics'] = analytics;

            // Recommendation
            var recommendation = {};
            recommendation = combineRecommendation(preJson['recommendation']);

            //advertising
            var advertising = {};
            var adBehavior = {};

            adBehavior = combineAdvertising(preJson['adBehavior']);
            advertising['adBehavior'] = adBehavior;

            advertising['recommendation'] = recommendation;
            setting['advertising'] = advertising;

            //premium feeds
            var premiumFeeds = {};
            premiumFeeds['apiKey'] = preJson['_api-key'];
            premiumFeeds['contextAffiliateId'] = '';

            // breaking news
            var breakingSection = getSectionByType('breaking', preJson['section']);
            if (Object.keys(breakingSection).length > 0) {
                var breakingNews = {};
                var feed = {};

                if (breakingSection['feed'] && breakingSection['feed'].length > 0) {
                    feed = breakingSection['feed'][0];

                    //set contextAffiliateId for premium feed
                    var contextAffiliateId = "";
                    if (feed['_frn-premium-url']) {
                        var pUrl = feed['_frn-premium-url'] ? feed['_frn-premium-url'] : "";
                        // get feedUrl
                         if (pUrl.indexOf("?")) {
                            breakingNews['feedUrl'] = pUrl.substring(0, pUrl.indexOf("?"));
                         }
                        //get contextAffiliateId
                        if (pUrl) {
                          var res = pUrl.split("&");
                          res.forEach(function(entry) {
                            if (entry && entry.lastIndexOf("context-affiliate-id=") > -1){
                                res = entry.split("=");
                                contextAffiliateId = contextAffiliateId ?  contextAffiliateId : (res.length > 0 ? res.slice(1).join("=") : "");
                            }
                          });
                        }
                    }
                    premiumFeeds['contextAffiliateId'] = contextAffiliateId;
                }
                setting['breakingNews'] = breakingNews;
                setting['premiumFeeds'] = premiumFeeds;
            } else {
                setting['premiumFeeds'] = premiumFeeds;
            }

            //traffic
            var traffic = {};
            traffic =  combineTraffic(preJson['traffic-map']);
            setting['traffic'] = traffic;

            //wsi
            var wsi = {}
            wsi = combineWsi(preJson['wsi']);

            //weather
            var weather = {};
            weather = combineWeather(preJson['weather-v2'], wsi);
            setting['weather'] = weather;

            //connect
            var connect = {};
            connect = combineConnect(preJson['settings']);

            //facebook
            var facebook = {};
            if (preJson['facebook'] && preJson['facebook']['_fb-app-id']) {
                facebook['facebookAppId'] = preJson['facebook']['_fb-app-id'];
                connect['facebook'] = facebook;
            }

            setting['connect'] = connect;

            // menu
            var menuData = preJson['section'];
            deleteMenuByType("homepage", menuData);
            deleteMenuByType("breaking", menuData);
            var menu = [];
            menu = combineMenu(menuData);

            //Item config
            itemConfig['theme'] = theme;
            itemConfig['setting'] = setting;
            itemConfig['menu'] = menu;

            return itemConfig;
        } catch (e) {
            return {code: 500, 'message': e.message};
        }
    }

    function combineMenu(data) {
        try {
            if (!data || Object.keys(data).length == 0) {
                return null;
            }
            var mappedData = util.mappingArray(data, mapping['menu']);

            return mappedData;
        }  catch (e) {
            e.message = "MENU: " + e.message;
            throw e;
        }
    }

    /**
    	Delete a menu in list by type
    */
    function deleteMenuByType(type, menuItems) {
    	for (var i = 0; i < menuItems.length; i ++) {
    		var item =  menuItems[i];
    		if (item['_type'] === type.toLowerCase()) {
    			 menuItems.splice(i, 1);
            }
    	}
    }

    function combineStyle(data) { //NEED UPDATE WHEN INTEGRATE TO CALYPSO
        try {
            var theme = {};
            if (!data || Object.keys(data).length == 0) {
                return {};
            }
            var mappedData = util.mappingNode(data, mapping['style']);

            theme['name'] = '';
            theme['style'] = mappedData;

            return theme;
        }  catch (e) {
            e.message = "STYLE: " + e.message;
            throw e;
        }
    }

    function combineReportingBehavior (data) {
        try {
            if (!data || Object.keys(data).length == 0) {
                return {};
            }

            var mappedData = {};
            mappedData['googleAnalyticsId'] = data['_id'];
            return mappedData;
        }
        catch (e) {
            e.message = "REPORT BEHAVIOR: " + e.message;
            throw e;
        }
    }

    function combineRecommendation(data) {
        try {
            var recommendation = {};
            var outbrain = {};
            if (!data || Object.keys(data).length == 0) {
                outbrain['enabled'] = false;
                recommendation['outbrain'] = outbrain;
                return recommendation;
            }

            outbrain = util.mappingNode(data, mapping['recommendation']);
            recommendation['outbrain'] = outbrain;

            return recommendation;
        }
        catch (e) {
            e.message = "REPORT BEHAVIOR: " + e.message;
            throw e;
        }
    }

    function combineSearch (data) {
        try {
            if (!data || Object.keys(data).length == 0) {
                return {};
            }

            var mappedData = {};
            mappedData = util.mappingNode(data, mapping['search']);
            return mappedData;
        } catch (e) {
            e.message = "SEARCH: " + e.message;
            throw e;
        }
    }

    function combineAdvertising(data) {
        try {
            if (!data || Object.keys(data).length == 0) {
                return {};
            }
             var mappedData = [];
             mappedData = util.mappingArray(data, mapping['adBehavior']);
             return mappedData;
        } catch (e) {
            e.message = "ADVERTISING: " + e.message;
            throw e;
        }

    }

    function combinePushBehavior(data) {
        try {
            if (!data || Object.keys(data).length == 0) {
                return {};
            }

            var pushBehavior = {};
            var parse = {};
            var urbanAirship = {};

            //push service
            pushBehavior['enabled'] = true;
            pushBehavior['defaultProvider'] = data['_frn-default-provider'];

            if (data['_frn-default-provider'] && data['_frn-default-provider'].toLowerCase() === 'parse') {
                parse['appId'] = data["_production-app-id"];
                parse['appKey'] = data["_production-app-key"];
                pushBehavior['parse'] = parse;
            } else if(data['_frn-default-provider'] && data['_frn-default-provider'].toLowerCase() === 'airship') {
                urbanAirship['appId'] = data['_production-app-id'];
                urbanAirship['appKey'] = data['_production-app-key'];
                urbanAirship['productionAppSecret'] = data['_production-app-secret'];
                pushBehavior['urbanAirship'] = urbanAirship;
            }

            //channel
            var channels = [];
            if (data['pushSegmentation'] && data['pushSegmentation'].length > 0) {
                for ( var i = 0; i < data['pushSegmentation'].length; i++){
                    var item = data['pushSegmentation'][i];
                    var channel = {};
                    channel['id'] = item['_tag'];
                    channel['name'] = item['_title'];
                    channels.push(channel);
                }
            }

            if (channels.length > 0) {
                pushBehavior['channels'] = channels;
            }

            return pushBehavior;
        }  catch (e) {
            e.message = "PUSH BEHAVIOR: " + e.message;
            throw e;
        }
    }

    function combineTraffic(data) {
        try {
            var traffic = {};
            if (Object.keys(data).length == 0) {
                traffic.general = {enabled: false};
                return traffic;
            }

            var general = {};
            var trafficLocations = [];
            general['enabled'] = true;
            general["showAds"] = !data["_suppress-ads"];
            traffic['general'] = general;

            var location = {};
            location['isDefault'] = true;
            location.name = '';
            location['defaultCenterLat'] = data['_default-center-lat'];
            location['defaultCenterLong'] = data['_default-center-long'];
            location['defaultAltitude'] = data['_default-altitude'];
            location['defaultOverlays'] = data['_default-overlays'];
            location['defaultLayer'] = data['_default-layer'];
            trafficLocations.push(location);

            traffic['trafficLocations'] = trafficLocations;
            return traffic;
        }  catch (e) {
            e.message = "TRAFFIC MAP: " + e.message;
            throw e;
        }
    }

    function combineWsi(data) {
        try {
            if (!data || Object.keys(data).length == 0) {
                return {};
            }
            var mappedData = {};
            mappedData = util.mappingNode(data, mapping['wsi']);

            return mappedData;
        } catch (e) {
            e.message = "WSI: " + e.message;
            throw e;
        }
    }

    function combineWeather(data, wsi) {
        try {
            var weather = {};
            var general = {};
            if (!data || Object.keys(data).length == 0) {
                general['enabled'] = false;
                weather['wsi'] = wsi;
                weather['general'] = general;
                return weather;
            }

            //general
            general['enabled'] = true;
            general["showAds"] = !data["_suppress-ads"];
            general['showRadarInNavMenu'] = data['_show-radar-in-navigation-menu'];
            weather['general'] = general;

            // wsi
            weather['wsi'] = wsi;

            // weather locations
            var weatherLocations = [];
             weatherLocations = combineWeatherLocation(data["weather-location"]);
            if (weatherLocations) {
                weather.weatherLocations = weatherLocations;
            }

           // weather sections
           var mappedSection = [];
           mappedSection = util.mappingArray(data['weather-section'], mapping['weatherSection']);
           combineWeatherSections(weather, mappedSection);

           return weather;
       } catch (e) {
            e.message = "WEATHER: " + e.message;
            throw e;
       }
    }

    function combineWeatherSections(weather, sectionsArray) {
        // serve weather
        var serverWeather = {};
        serverWeather = getWeatherSection('severe-weather-alert', sectionsArray);
        weather['severeWeather'] = serverWeather;

        // initialize conditions
        var conditionsSection = {};

        //basic
        var basicSection = {};
        basicSection = getWeatherSection('conditions', sectionsArray)
        conditionsSection['basic'] = basicSection;

        //detail
        var detailSection = getWeatherSection('detailed-readings', sectionsArray);
        conditionsSection['detailed'] = detailSection;

        //sunMoon
        var sunMoonSection = getWeatherSection('sun-and-moon', sectionsArray);
        conditionsSection['sunMoon'] = sunMoonSection;

        //setting conditions
        weather['conditions'] = conditionsSection;

        // textForecast
        var textForecastSection = getWeatherSection('todays-forecast', sectionsArray);
        weather['textForecast'] = textForecastSection;

        // daily forecast
        var dailyForecastSection = getWeatherSection('daily-forecasts', sectionsArray);
        weather['dailyForecast'] = dailyForecastSection;

        // hourly forecast
        var hourlyForecastSection = getWeatherSection('hourly-forecasts', sectionsArray);
        weather['hourlyForecast'] = hourlyForecastSection;

        // video forecast
        var videoForecastSection = getWeatherSection('video-report', sectionsArray);
        weather['videoForecast'] = videoForecastSection;

        //interactive Radar
        var radarSection = getWeatherSection('radar', sectionsArray);
        weather['interactiveRadar'] = radarSection;

        //weather news
        var weatherNewsSection = getWeatherSection('weather-news', sectionsArray);
        weather['weatherNews'] = weatherNewsSection;

        // weather images
        var weatherImagesSection = getWeatherSection('station-graphics', sectionsArray);
        weather['weatherImages'] = weatherImagesSection;

        // weather layout
        //FIRST: Build the weather layout from sections of imported file(enabled sections)
        var weatherLayout = [];
        weatherLayout = buildWeatherLayout(sectionsArray);

        //SECOND: Adding the rest weather layout (disabled sections)
        var flgExisted = false;
        for (var ix = 0; ix < constant.weatherSection.length; ix ++) {
               flgExisted = false;
               if (sectionsArray) {
                    for (var jx = 0; jx < sectionsArray.length; jx ++) {
                       if (!sectionsArray[jx].name) {
                           flgExisted = false;
                           break;
                       } else if (sectionsArray[jx].name.toLowerCase() === constant.weatherSection[ix].toLowerCase()) { // check if weather section in enabled list
                           flgExisted = true;
                           break;
                       }
                   }
               }

                //if weather section does not exist, adding to the weather layout list
               if (flgExisted == false) {
                   switch (constant.weatherSection[ix]) {
                       case 'severe-weather-alert':
                         break;
                       case 'conditions':
                         weatherLayout.push({type: "basic", label: "Basic Conditions"});
                         break;
                       case 'weather-news':
                         weatherLayout.push({type: "weatherNews", label: "Weather News"});
                         break;
                       case 'station-graphics':
                         weatherLayout.push({type: "weatherImages", label: "Weather Images"});
                         break
                       case 'todays-forecast':
                         weatherLayout.push({type: "textForecast", label: "Text Forecast"});
                         break;
                       case 'detailed-readings':
                         weatherLayout.push({type: "detailed", label: "Detailed Readings"});
                         break;
                       case 'hourly-forecasts':
                          weatherLayout.push({type: "hourlyForecast", label: "Hourly Forecast"});
                         break;
                       case 'radar':
                         weatherLayout.push({type: "radar", label: "Radar"});
                         break;
                       case 'sun-and-moon':
                         weatherLayout.push({type: "sunMoon", label: "Sun and Moon"});
                         break;
                       case 'daily-forecasts':
                         weatherLayout.push({type: "dailyForecast", label: "Daily Forecast"});
                         break;
                       case 'video-report':
                         weatherLayout.push({type: "videoForecast", label: "Video Forecast"});
                   }
               }
          }
           weather['weatherLayout'] = weatherLayout;

    }

    /**
    	Get weather section by type
    */
    function getWeatherSection(type, weatherSectionArr) {
    	var fullWeatherSectionFields = ['enabled', 'fgColor', 'bgColor', 'conditions', 'feedUrl', 'layer'];
        var result = {};
        var weatherItem = {};

        //find the appropriate section
        if (weatherSectionArr && weatherSectionArr.length > 0) {
            for (var i = 0 ; i < weatherSectionArr.length; i++) {
                if (weatherSectionArr[i].name === type) {
                    weatherItem = weatherSectionArr[i];
                    break;
                }
            }
        }

    	//build data for the section
    	if(Object.keys(weatherItem).length > 0) {
    		fullWeatherSectionFields.forEach(function(field) {
    			if (weatherItem[field]) {
    				result[field] =  weatherItem[field];
    			}
    		});
    		result['enabled'] = true;
    	} else {
    		result['enabled'] = false;
    	}

        return result;
    }

    /**
    	Build weather layout
    */
    function buildWeatherLayout(weatherSectionArr) {
    	var wtLayout = [];
    	var item = {};

    	if(!weatherSectionArr || weatherSectionArr.length == 0){
    		return wtLayout;
    	}
    	for (var index = 0; index < weatherSectionArr.length; index ++) {
    		item = 	weatherSectionArr[index];
    		if (item) {
    		  switch (item.name) {
    			case 'conditions':
    			  wtLayout.push({type: "basic", label: "Basic Conditions"});
    			  break;
    			case 'weather-news':
    			  wtLayout.push({type: "weatherNews", label: "Weather News"});
    			  break;
    			case 'station-graphics':
    			  wtLayout.push({type: "weatherImages", label: "Weather Images"});
    			  break
    			case 'todays-forecast':
    			  wtLayout.push({type: "textForecast", label: "Text Forecast"});
    			  break;
    			case 'detailed-readings':
    			  wtLayout.push({type: "detailed", label: "Detailed Readings"});
    			  break;
    			case 'hourly-forecasts':
    			  wtLayout.push({type: "hourlyForecast", label: "Hourly Forecast"});
    			  break;
    			case 'radar':
    			  wtLayout.push({type: "radar", label: "Radar"});
    			  break;
    			case 'sun-and-moon':
    			  wtLayout.push({type: "sunMoon", label: "Sun and Moon"});
    			  break;
    			case 'daily-forecasts':
    			  wtLayout.push({type: "dailyForecast", label: "Daily Forecast"});
    			  break;
    			case 'video-report':
    			  wtLayout.push({type: "videoForecast", label: "Video Forecast"});
    		  }
    		}
    	}

    	return wtLayout;
    }

    function combineWeatherLocation(data) {
        if (!data || data.length == 0) {
            return null;
        }

        var weatherLocation = [];
        weatherLocation = util.mappingArray(data, mapping["weatherLocation"]);
        return weatherLocation;
    }

    function combineConnect(data) {
        try {
            if (!data || Object.keys(data).length == 0) {
                return {};
            }
            var mappedData = {};
            mappedData = util.mappingNode(data, mapping['connect']);

            return mappedData;
        } catch (e) {
             e.message = "CONNECT: " + e.message;
             throw e;
        }
    }

/**
	Get section by type
*/
function getSectionByType(type, sectionItems) {
	var section = {};
	if (sectionItems && sectionItems.length > 0) {
        for(var i = 0; i < sectionItems.length; i ++) {
            var item =  sectionItems[i];
            if (item['_type'].toLowerCase() === type.toLowerCase()) {
                section = item;
                break;
            }
        }
	}
	return section;
}

}
module.exports = IOSConverter;