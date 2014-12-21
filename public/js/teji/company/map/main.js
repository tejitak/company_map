/**
 * main
 */
(function(global) {
    "use strict";
    
    var Vue = require("vue");
    var $ = require("jquery");
    var util = require("../common/util");
    var vuePopup = require("../components/popup.vue");
    var vuePopupContent = require("../components/popupContent.vue");

    var app = module.exports = new Vue({

        el: '#app',

        components: {
            "vue-popup": vuePopup,
            "vue-popup-content": vuePopupContent
        },

        data: {
            initPos: {
                lat: 35.658517,
                lng: 139.701334
            },
            selected: null,
            popupOpened: false
        },

        created: function() {
            this.init();
        },

        methods: {
            init: function(){
                var map = this._map = new google.maps.Map(document.getElementById("map_canvas"), {
                    center: new google.maps.LatLng(this.initPos.lat, this.initPos.lng),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                this._infowin = new google.maps.InfoWindow({});
                this.updateMarkers(data);
                this.$on("popupClose", function(){
                    this.popupOpened = false;
                    // this.selected = null;
                }.bind(this));
            },

            updateMarkers: function(items){
                if(!items){ return; }
                var that = this, map = this._map;
                $.each(items, function(i, item){
                    var jobCount = item.job_count;
                    var iconSize = jobCount * 10;
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(item.lat, item.lng),
                        icon: new google.maps.MarkerImage(item.logo_url, null, null, null, new google.maps.Size(iconSize, iconSize)),
                        zIndex: i,
                        map: map
                    });
                    google.maps.event.addListener(marker, 'mouseover', function() {
                        that._infowin.setContent("<div>" + item.name + "</div><div>" + item.address + "</div><div>" + item.company_url + "</div>");
                        that._infowin.open(map, marker);
                    });
                    google.maps.event.addListener(marker, 'mouseout', function() {
                        that._infowin.close();
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        that.selected = item;
                        that.popupOpened = true;
                    });
                });
            }
        }
    });
    // google.maps.event.addDomListener(window, 'load', initialize);
})(window);