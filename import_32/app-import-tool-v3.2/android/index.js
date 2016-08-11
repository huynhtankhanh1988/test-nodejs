var constant = require("./const.json");
var mapping = require("./mapping.json");
var Util = require('../util');
var util = new Util();

var AndroidConverter = function() {
    AndroidConverter.prototype.combineItemConfig = function(preJson) {
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
            //analytics
            var analytics = {};
            analytics = combineReportingBehavior(preJson['reportingBehavior']);
            setting['analytics'] = analytics;

            //search
            var search = {};
            search = combineSearch(preJson['frn-search']);
            setting['search'] = search;

            //premium feeds
            var premiumFeeds = {};
            premiumFeeds['apiKey'] = preJson['_api-key'];
            premiumFeeds['contextAffiliateId'] = '';
            setting['premiumFeeds'] = premiumFeeds;

            // pushBehavior
            var pushBehavior = {};
            if (preJson['pushBehavior']) {
                pushBehavior = combinePushBehavior(preJson['pushBehavior']);
            } else {
                pushBehavior['enabled'] = false;
            }
            setting['pushBehavior'] = pushBehavior;

            //traffic
            var traffic = {};
            traffic =  combineTraffic(preJson['traffic-map']);
            setting['traffic'] = traffic;

            //wsi
            var wsi = {}
            wsi = combineWsi(preJson['wsi']);

            //weather
            var weather = {};
            weather = combineWeather(preJson['weather'], wsi);
            setting['weather'] = weather;

            //connect
            var connect = {};
            connect = combineConnect(preJson['settings']);

            //facebook
            var facebook = {};
            facebook['facebookAppId'] = preJson['facebook']['_fb-app-id'];

            connect['facebook'] = facebook;
            setting['connect'] = connect;

            //
            itemConfig['setting'] = setting;
            itemConfig['theme'] = theme;
            return itemConfig;
        } catch (e) {
            return {code: 500, 'message': e.message, ex: e};
        }
    }

    function combineStyle(data) {
        var theme = {};
        if (!data || Object.keys(data).length == 0) {
            return {};
        }
        var mappedData = util.mappingNode(data, mapping['style']);

        theme['name'] = '';
        theme['style'] = mappedData;

        return theme;
    }

    function combineReportingBehavior (data) {
        if (!data || Object.keys(data).length == 0) {
            return {};
        }

        var mappedData = {};
        mappedData['googleAnalyticsId'] = data['_id'];
        return mappedData;
    }

    function combineSearch (data) {
        if (!data || Object.keys(data).length == 0) {
            return {};
        }

        var mappedData = {};
        mappedData = util.mappingNode(data, mapping['search']);
        return mappedData;
    }

    function combinePushBehavior(data) {
        if (!data || Object.keys(data).length == 0) {
            return {};
        }

        var pushBehavior = {};
        var item = {};
        var parse = {};
        var urbanAirship = {};

        //push service
        pushBehavior['enabled'] = true;
        pushBehavior['defaultProvider'] = data["_frn-default-provider"];
        if (data['pushService'] && data['pushService'].length > 0) {
            for (var index = 0; index < data['pushService'].length; index++) {
                item = {};
                item = data['pushService'][index];
                if (item && item['_provider'] == "parse") {
                    parse['appId'] = item["_production-app-id"];
                    parse['appKey'] = item["_production-app-key"];
                } else if (item && item['_provider'] == "airship") {
                    urbanAirship['appId'] = item["_production-app-id"];
                    urbanAirship['appKey'] = item["_production-app-key"];
                    urbanAirship['showInbox'] = data["_inbox-enabled"];
                    urbanAirship['productionAppSecret'] = item["_production-app-secret"];
                    urbanAirship['productionGcmSender'] = item["_production-gcm-sender"];
                }
            }
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

        if (Object.keys(parse).length == 0) {
            parse['appId'] = "";
            parse['appKey'] = "";
        }
        if (Object.keys(urbanAirship).length == 0) {
            urbanAirship['appId'] = "";
            urbanAirship['appKey'] = "";
            urbanAirship['showInbox'] = false;
            urbanAirship['productionAppSecret'] = "";
        }
        pushBehavior['parse'] = parse;
        pushBehavior['urbanAirship'] = urbanAirship;

        if (channels.length > 0) {
            pushBehavior['channels'] = channels;
        }

        return pushBehavior;
    }

    function combineTraffic(data) {
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
    }

    function combineWsi(data) {
        if (!data || Object.keys(data).length == 0) {
            return {};
        }
        var mappedData = {};
        mappedData = util.mappingNode(data, mapping['wsi']);

        return mappedData;
    }

    function combineWeather(data, wsi) {
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
        weather['weatherLocations'] = weatherLocations;

       // weather sections


        return weather;
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
        if (!data || Object.keys(data).length == 0) {
            return {};
        }
        var mappedData = {};
        mappedData = util.mappingNode(data, mapping['connect']);

        return mappedData;
    }

}
module.exports = AndroidConverter;