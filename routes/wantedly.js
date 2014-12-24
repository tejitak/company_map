var express = require('express');
var resourceBundle = require('./modules/resourceBundle');
var request = require('request');
var tough = require('tough-cookie');
var url = require('url');
var config = require('../config').config;
var router = express.Router();

var apikey = {};
try{ apikey = require('../apikey'); } catch(e) {}

// for debug
// require('request-debug')(request);

var cookieFromResponse = function(response){
    if(!response || !response.headers){ return ''; }
    var setCookie = response.headers['set-cookie'];  
    // console.log("response setCookie: " + JSON.stringify(setCookie));
    var cookie = '';  
    if (Array.isArray(setCookie)) {  
        for (var i = 0, len = setCookie.length; i < len; i++) {  
            cookie += setCookie[i].split(';')[0]  
            if (i < len - 1)  
                cookie += '; '  
        }  
    }
    return cookie;
};

var getReqOptions = function(url, cookie){
    return {
        url: url || 'https://www.wantedly.com/',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:33.0) Gecko/20100101 Firefox/33.0',
            'Host': 'www.wantedly.com',
            'Referer': 'https://www.wantedly.com/',
            'Cookie': cookie || null
        }
    }
};

var postReqOptions = function(cookie, csrfToken){
    return {
        url: 'https://www.wantedly.com/user/sign_in',
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:33.0) Gecko/20100101 Firefox/33.0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'www.wantedly.com',
            'Origin': 'https://www.wantedly.com',
            'Referer': 'https://www.wantedly.com/',
            'Cookie': cookie || null
        },
        // followAllRedirects: true,
        // jar: true,
        form: {
            'authenticity_token': csrfToken,
            'user[email]': apikey.wantedly_email,
            'user[password]': apikey.wantedly_password,
            'commit': 'ログイン'
        }
    };
};

router.get('/list', function(req, res) {
    console.log("start wantedly crawling");
    var API_BASE = "https://www.wantedly.com/search?t=companies&page=";
    var REQUEST_DELAY = 1000;
    // var MAX_PAGE = 500;
    var MAX_PAGE = 5;
    // e.g. ["https://www.wantedly.com/search?t=companies&page=1", "https://www.wantedly.com/search?t=companies&page=4"];
    var APIs = [];
    for(var i=1; i<=MAX_PAGE; i++){
        APIs.push(API_BASE + i);
    }
    var page = req.param("page");

    // access to wantedly top page to get authentication token
    // <meta content="authenticity_token" name="csrf-param" />
    // <meta content="vQd4u1aPKvhQbNWS5eHX4uvlKnE1JfWaY5InrcA4r00=" name="csrf-token" />
    request(getReqOptions(), function (error, response, body) {
        var re = /meta content="([^"]*)" name="csrf-token"/g;
        var result = re.exec(body);
        if(result && result[1]){
            var csrfToken = result[1];
            var cookie = cookieFromResponse(response);
            console.log("csrf-token: " + result[1]);
            console.log("auth with: " + apikey.wantedly_email);
            request(postReqOptions(cookie, csrfToken), function (error, response, body) {
                // request again with redirect URL and the cookie
                if (!error && response.statusCode == 301){
                    var redirectURL = response.uri;
                    cookie = cookieFromResponse(response);
                    var list = [];

                    try{
                        function callAPIs(APIs){
                            var API = APIs.shift();
                            console.log("Call API: " + API);
                            if(API){
                                request(getReqOptions(API, cookie), function (error, response, body) {
                                    // update cookie only for "_huntr_session_production"
                                    cookie = cookieFromResponse(response);
                                    body.match(/<a href="\/companies\/([^"]*)"/g).forEach(function(str){
                                        // e.g. <a href="/companies/bpm-gr-co"
                                        var r = /<a href="\/companies\/([^"]*)"/.exec(str);
                                        if(r && r[1] && list.indexOf(r[1]) === -1){
                                            list.push(r[1]);
                                        }
                                    });
                                    if(APIs.length == 0){
                                        // all completed
                                        console.log("completed");
                                        console.log(list.join(","));
                                        res.contentType('text/html; charset=utf-8');
                                        res.send(list.join("<br>"));
                                        return;
                                    }else{
                                        console.log("count: " + list.length);
                                        // call next with delay
                                        setTimeout(function(){
                                            callAPIs(APIs);
                                        }, REQUEST_DELAY);
                                    }
                                });
                            }
                        }
                        // start continuous requests
                        callAPIs(APIs);
                    }catch(e){
                        console.log("error");
                        console.log(list.join(","));
                        res.contentType('text/html; charset=utf-8');
                        res.send(list.join("<br>"));
                        return;
                    }
                }
            });
        }else{
            res.contentType('application/json');
            res.send({success: false});
        }
    });
});

module.exports = router;
