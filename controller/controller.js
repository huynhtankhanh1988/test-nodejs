 var https = require('https');
 var express = require('express');
var fs = require("fs");

var Client = require('node-rest-client').Client;
var client = new Client();

 exports.getMenu = function(req, res){
 var end_point = "/v1.0/menu/" +  req.params.id;
 var options = {
    host: 'cms.ddev1.worldnow.com',
    path: end_point,
    method: 'GET',
    headers: {
       'Authorization': 'struong~worldnow113~6',
       'Content-Type': 'application/xml',
       'access-control-allow-origin': '*'
     }
  };

  // do the GET request
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  var reqGet = https.request(options, function(response) {
      response.on('data', function(d) {
        res.render('view1', { title: d })
      });

  });

  reqGet.end();
  reqGet.on('error', function(e) {
      console.error(e);
  });
};

module.exports.searchLink = function(req, res) {

  var reqBody = '<linksplussearchcriteria xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://api.worldnow.com/cms">'
                  + '<affiliateid>6</affiliateid>'
                  + '</linksplussearchcriteria>';

  // prepare the header
  var postheaders = {
      data: reqBody,
      'Content-Type' : 'application/xml',
      'Authorization': 'struong~worldnow113~6'
  };

  var args = {
    data: reqBody,
    headers: postheaders
  };

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  client.post("https://cms.ddev1.worldnow.com/v1.0/links/search", args, function(data,response) {
  	console.log("return data: " + data);
      res.render('view1', { title: data })
  });
};
