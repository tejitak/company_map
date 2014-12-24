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
            initPos: {},
            selectedItem: {},
            popupOpened: false,
            initialized: false,
            loading: false
        },

        created: function() {
            var that = this;
            // set intial position
            this.initPos = {lat: 35.658517, lng: 139.701334};
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
                    url: "/api/detail/" + 1,
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
            setTimeout(function(){
                that.items = data;
                that.initialized = true;
            }, 50);
        },

        methods: {
        }
    });
    // google.maps.event.addDomListener(window, 'load', initialize);
})(window);