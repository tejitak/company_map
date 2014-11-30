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
        },

        created: function() {
            console.log($(".map_canvas"));
        },

        methods: {
        }
    });
})(window);