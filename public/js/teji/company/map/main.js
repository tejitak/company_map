/**
 * main
 */
(function(global) {
    "use strict";
    
    var Vue = global.Vue = require("vue");
    var $ = global.$ = require("jquery");
    var util = global.util = require("../common/util");
    var vuePopup = require("../components/popup.vue");
    var vuePopupContent = require("../components/popupContent.vue");
    var vueMap = require("../components/map.vue");
    var vueTab = require("../components/tab.vue");
    var vueDrawer = require("../components/drawer.vue");
    var vueAddCompany = require("../components/add-company.vue");
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
            "vue-add-company": vueAddCompany
        },

        data: {
            items: [],
            mapPos: {lat: 0, lng: 0},
            selectedItem: {},
            popupOpened: false,
            drawerOpened: false,
            addCompanyModalOpened: false,
            navigationOpened: !util.isMobileScreen(),
            initialized: false,
            loading: false,
            creators: [{
                name: "Takuya Tejima",
                img: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/p320x320/14587_10152497392850662_1401841658995934034_n.jpg?oh=a71bf5418ca7a50fc8d0055fb1f26ba1&oe=55350919&__gda__=1430056742_4ca41af22ca52c6ec937e320ff719429",
                job: "Developer"
            },{
                name: "Kon Yuichi",
                img: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/v/t1.0-1/c17.17.216.216/548983_673147119381101_1888795259_n.jpg?oh=3f044dbfd5f81912908bc215013c98ec&oe=553E5BD5&__gda__=1429938135_705f713a342b331c9fa24d5f82044122",
                job: "Developer"
            },{
                name: "Tsuyoshi Higuchi",
                img: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p320x320/10622902_10152773737576554_3100748931420217045_n.jpg?oh=6bddcad5161cde9c029e764f0d867ef4&oe=54FCA3C6&__gda__=1428908990_4df25b3f352d79699aabcea69ee978fa",
                job: "Designer"
            },{
                name: "Yoshimitsu Torii",
                img: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p320x320/1653847_656899447711039_2131191181_n.jpg?oh=78fb722168df0a0539d90a361cf17faa&oe=553D1EB3&__gda__=1429691033_9ca9d0de3a0ceb97ff9b63045de8616b",
                job: "Developer"
            }]
        },

        created: function() {
            var that = this;
            // set intial position
            this.onChangeArea(35.658517, 139.701334);
            this.$on("onAddCompanyModalClose", function(){
                that.addCompanyModalOpened = false;
            });
            this.$on("onPopupClose", function(){
                that.popupOpened = false;
            });
            this.$on("onDrawerClose", function(){
                that.drawerOpened = false;
            });
            this.$on("onNavigationClose", function(){
                that.navigationOpened = false;
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
          
            toggleAddCompanyModal: function(){
                this.addCompanyModalOpened = !this.addCompanyModalOpened;
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