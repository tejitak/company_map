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
    var vueMap = require("../components/map.vue");
    var draggable = require("../directives/draggable");

    Vue.config.debug = true;

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
                    // TODO: temp
                    url: "/api/v1/startups/" + 1,
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
            // TODO: replace with a real API
            $.ajax({
                type: "GET",
                url: "/api/v1/startups/list",
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
})(window);