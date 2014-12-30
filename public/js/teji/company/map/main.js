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
    var vueTab = require("../components/tab.vue");
    var vueDrawer = require("../components/drawer.vue");
    var draggable = require("../directives/draggable");

    Vue.config.debug = OPTION.debug;

    var app = module.exports = new Vue({

        el: '#app',

        components: {
            "vue-map": vueMap,
            "vue-popup": vuePopup,
            "vue-popup-content": vuePopupContent,
            "vue-tab": vueTab,
            "vue-drawer": vueDrawer,
        },

        data: {
            items: [],
            mapPos: {lat: 0, lng: 0},
            selectedItem: {},
            popupOpened: false,
            drawerOpened: false,
            initialized: false,
            loading: false
        },

        created: function() {
            var that = this;
            // set intial position
            this.onChangeArea(35.658517, 139.701334);
            this.$on("onPopupClose", function(){
                that.popupOpened = false;
            });
            this.$on("onDrawerClose", function(){
                that.drawerOpened = false;
            });
            this.$on("onMapMarkerClick", this.onChangeSelection.bind(this));
            this.refresh();
        },

        methods: {
            refresh: function(){
                var that = this;
                $.ajax({
                    type: "GET",
                    // url: "https://start-map.herokuapp.com/api/v1/startups.json",
                    url: Vue.config.debug ? "/api/v1/startups/list" : "/api/v1/startups.json",
                    dataType: "json",
                    cache: false,
                    success: function(res){
                        // sort by like_count
                        res.sort(function(a, b){
                            if(a.like_count < b.like_count){ return 1; }
                            if(a.like_count > b.like_count){ return -1; }
                            return 0;
                        });
                        that.items = res;
                    },
                    complete: function(){
                        that.initialized = true;
                    }
                });
            },

            onChangeSelection: function(id){
                var that = this;
                this.loading = true;
                var selectedItem = this.selectedItem = this.getItemById(id);
                if(!selectedItem){ return; }
                this.popupOpened = true;
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
            },

            onChangeArea: function(lat, lng){
                var pos = this.mapPos = {lat: lat, lng: lng};
                this.$broadcast("changeArea", pos);
            },

            getItemById: function(id){
                var arr = $.grep(this.items, function(n, i){
                   return n.id === id;
                });
                return (arr && arr[0]) || null;
            },

            showAboutUs: function(){
                this.drawerOpened = true;
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