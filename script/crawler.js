/*
  script/ceawler.js

  resources/company_ids.jsにあるcompanyIDのリストを使ってスクレイピングをするツール
*/

//Initialize instance
var request = require("request");
var cheerio = require("cheerio");

var company_ids = require('../resources/company_ids');

var output = [];

var i = 0;

function outputFunc(){
    if ( i >= company_ids.length ){
        console.log( output );
    }
};

function crawl(name){
    i++;  //counter
    var requestUrl = "https://www.wantedly.com/companies/" + name + "/info";
    request({url: requestUrl}, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);

            // 募集人数
            var job_count_raw =
                $("ul.wt-ui-tab > li:nth-child(3) > a").text();
            var job_count_list = /\((\d+)\)/.exec(job_count_raw);
            var job_count;
            if(job_count_list)
                job_count = job_count_list.pop();

            // 従業員数
            var company_basic_info_html =
                $("section.company_basic_info > ul").text();
            var employee_count_list =
                /(\d+)\n?人/.exec(company_basic_info_html);
            var employee_count;
            if (employee_count_list){
                employee_count = employee_count_list[1];
            }
            // 創立年月
            var foundation_date_list =
                /(\d+年\d+月)/.exec(company_basic_info_html);
            var foundation_date;
            if (foundation_date_list){
                foundation_date = foundation_date_list[1];
            }

            // 会社情報
            var company_name = $("h1.company-name > a").text();
            var address = $("section.section_location.article > address").text();
            var logo_url = $("div.profile-photo > a > span > img").attr("src");
            var company_url = $("p.company-url > a").text();

            // 私たちについて
            var about_me = $("section.section_origin > p").text();

            // 経度緯度 (あとでちゃんと取る)
            var lats_raw_list = /Gmaps\.map\.markers\s\=\s\[(.*)\];/.exec(body);
            var lats_raw;
            if(lats_raw_list){
                lats_raw = lats_raw_list.pop();
            }

            var lats;
            if( lats_raw ){
                lats = JSON.parse(lats_raw);
            }

            var company = {
                "id" : i,
                "name" : name,
                "company_name" : company_name,
                "address" : address,
                "logo_url" : logo_url,
                "company_url" : company_url,
                "job_count": job_count || null,
                "employee_count": employee_count || null,
                "foundation_date": foundation_date || null,
                "about_me": about_me || null,
                "lat": (lats)?lats.lat: null,
                "lng": (lats)?lats.lng: null
            };
            output.push( company );
            outputFunc();
        }

        else {
            console.log("--- error occcured ---");
            if (error && "code" in error) {
                console.log("Error No:" + error.errno);
                console.log("Error Code:" + error.code);
                console.log("Error Syscall:" + error.syscall);
                console.log("Status Code:" +  response.statusCode);
            }
        }
    });
}

function sleep(x) {
    return function(func) {
        setTimeout(function() {
            console.warn(i + company_ids[x]);
            crawl(company_ids[x]);
            func();
        }, 500);
    }
}

function loop(x) {
    sleep(x)(function(){
        if(x < company_ids.length -1){
            loop(x+1);
        }
    });
}

loop(0);
