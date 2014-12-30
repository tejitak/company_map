/**
 * main
 */
(function(global) {
    "use strict";
    
    var Vue = global.Vue = require("vue");
    var $ = global.$ = require("jquery");
    var util = require("../common/util");
    var vuePopup = require("../components/popup.vue");
    var vuePopupContent = require("../components/popupContent.vue");
    var vueMap = require("../components/map.vue");
    var draggable = require("../directives/draggable");

    Vue.config.debug = OPTION.debug;

    var app = module.exports = new Vue({

        el: '#app',

        components: {
            "vue-map": vueMap,
            "vue-popup": vuePopup,
            "vue-popup-content": vuePopupContent
        },

        data: {
            items: [],
            selectedLatLngStr: "35.658517,139.701334",
            mapPos: {lat: 0, lng: 0},
            selectedItem: {},
            popupOpened: false,
            initialized: false,
            loading: false
        },

        created: function() {
            var that = this;
            // set intial position
            this.onChangeArea();
            this.$on("onPopupClose", function(){
                that.popupOpened = false;
            });
            this.$on("onMapMarkerClick", function(item){
                if(!item){ return; }
                that.loading = true;
                that.selectedItem = item;
                that.popupOpened = true;
                $.ajax({
                    type: "GET",
                    // https://start-map.herokuapp.com/api/v1/startups/1.json
                    url: Vue.config.debug ? "/api/v1/startups/" + 1 : "/api/v1/startups/" + item.id + ".json",
                    dataType: "json",
                    cache: false,
                    success: function(res){
                        that.selectedItem.$add("detail", res || {});
                    },
                    complete: function(){
                        that.loading = false;
                    }
                });
            });
            $.ajax({
                type: "GET",
                // url: "https://start-map.herokuapp.com/api/v1/startups.json",
                url: Vue.config.debug ? "/api/v1/startups/list" : "/api/v1/startups.json",
                dataType: "json",
                cache: false,
                success: function(res){
                    that.items = res;
                },
                complete: function(){
                    that.initialized = true;
                }
            });
        },

        methods: {
            onChangeArea: function(){
                var posList = this.selectedLatLngStr.split(",");
                var pos = this.mapPos = {lat: posList[0], lng: posList[1]};
                this.$broadcast("changeArea", pos);
            }
        }
    });
    
    // temp window size adjustment
    var resize = function(){
        var $win = $(window), $body = $(document.body), winH = $win.height(), $container = $(".container"), $footer = $("footer");
        $body.height(winH);
        $container.height(winH - $footer.height());
    };
    resize();
    google.maps.event.addDomListener(window, 'load', resize);
    $(window).on("resize", resize);

})(window);