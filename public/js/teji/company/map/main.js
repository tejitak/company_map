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
            "vue-drawer": vueDrawer
        },

        data: {
            items: [],
            mapPos: {lat: 0, lng: 0},
            selectedItem: {},
            popupOpened: false,
            drawerOpened: false,
            navigationOpened: !util.isMobileScreen(),
            initialized: false,
            loading: false,
            creators: [{
                name: "Takuya Tejima",
                img: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/p50x50/14587_10152497392850662_1401841658995934034_n.jpg?oh=e5e122044d108a338132222030fbe8e7&oe=55407FC2&__gda__=1429770769_d97dc8fd5671e97b04e70ba26da483b8",
                job: "Developer"
            },{
                name: "Kon Yuichi",
                img: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/v/t1.0-1/c17.17.216.216/s50x50/548983_673147119381101_1888795259_n.jpg?oh=c6baba3956b34fa279c886824ede3717&oe=54FD5232&__gda__=1428601816_e4d9279ec6e52f986a11f63816e8937e",
                job: "Developer"
            },{
                name: "Tsuyoshi Higuchi",
                img: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p50x50/10622902_10152773737576554_3100748931420217045_n.jpg?oh=0a340334de50d65f08eb231c994758e3&oe=5538EA81&__gda__=1429024615_413f499555625994543bc8d3eb17816b",
                job: "Designer"
            },{
                name: "Yoshimitsu Torii",
                img: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p50x50/1653847_656899447711039_2131191181_n.jpg?oh=f6dac5688c9c5c4dee25845a8461e6a5&oe=54FAA972&__gda__=1428645706_8bc6946197c36c4ecf6923b9e156abf4",
                job: "Developer"
            }]
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
                    url: Vue.config.debug ? "/api/v1/startups/list" : "/api/v1/startups.json?sort=like_count",
                    dataType: "json",
                    cache: false,
                    success: function(res){
                        that.initialized = true;
                        that.items = res;
                    },
                    error: function(){
                        that.initialized = true;
                    }
                });
            },

            onChangeSelection: function(id){
                var that = this;
                this.loading = true;
                var item = this.selectedItem = this.getItemById(id);
                if(!item){ return; }
                this.popupOpened = true;
                $.ajax({
                    type: "GET",
                    // https://start-map.herokuapp.com/api/v1/startups/1.json
                    url: Vue.config.debug ? "/api/v1/startups/" + 1 : "/api/v1/startups/" + id + ".json",
                    dataType: "json",
                    cache: false,
                    success: function(res){
                        that.selectedItem.$add("detail", res || {});
                        that.$broadcast("changeSelection", id);
                    },
                    complete: function(){
                        that.loading = false;
                    }
                });
            },

            onChangeArea: function(lat, lng, cb){
                var pos = this.mapPos = {lat: lat, lng: lng};
                this.$broadcast("changeArea", pos, cb);
            },

            getItemById: function(id){
                var arr = $.grep(this.items, function(n, i){
                   return n.id === id;
                });
                return (arr && arr[0]) || null;
            },

            toggleAboutUs: function(){
                this.drawerOpened = !this.drawerOpened;
            },

            toggleNavigation: function(){
                this.navigationOpened = !this.navigationOpened;
            }
        }
    });
    
    // temp window size adjustment
    var resize = function(){
        var $win = $(window),
        $body = $(document.body),
        windowHeight = $win.height(),
        $containers = {
            root: $(".container"),
            tab: [
              $("[role=tabs] [function=scroll-1]"),
              $("[role=tabs] [function=scroll-2]")
            ]
        },
        $tabTrigger = $("[role=tabs] [role=tab-trigger]"),
        $listFilter = $("[role=tabs] [role=filter]"),
        $footer = $("footer");
        
        var $rootNagativeHeight = windowHeight - $footer.height();
        $body.height(windowHeight);
        
        $containers.root.height($rootNagativeHeight);
        $containers.tab[0].height($rootNagativeHeight - $tabTrigger.outerHeight());
        $containers.tab[1].height($rootNagativeHeight - $tabTrigger.outerHeight() - $listFilter.outerHeight());
    };
    resize();
    google.maps.event.addDomListener(window, 'load', resize);
    $(window).on("resize", resize);

})(window);