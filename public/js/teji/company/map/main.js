/**
 * main
 */
(function(global) {
    "use strict";
    
    var Vue = require("vue");
    var $ = require("jquery");
    var util = require("../common/util");

    var app = module.exports = new Vue({

        el: '#app',

        data: {
            initPos: {
                lat: 35.658517,
                lon: 139.701334
            }
        },

        created: function() {
            this.init();
        },

        methods: {
            init: function(){
                var map = this._map = new google.maps.Map(document.getElementById("map_canvas"), {
                    center: new google.maps.LatLng(this.initPos.lat, this.initPos.lon),
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                this._infowin = new google.maps.InfoWindow({});
                this.updateMarkers(data);
            },

            updateMarkers: function(items){
                if(!items){ return; }
                var that = this, map = this._map;
                $.each(items, function(i, item){
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(item.lat, item.lon),
                        map: map
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        that._infowin.setContent("<div>" + item.name + "</div><div>" + item.address + "</div><div>" + item.url + "</div>");
                        that._infowin.open(map, marker);
                    });
                });
            }
        }
    });

    // google.maps.event.addDomListener(window, 'load', initialize);
})(window);