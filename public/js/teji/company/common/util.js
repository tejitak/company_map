(function() {
    "use strict";
    var $ = require("jquery");

    module.exports = {

        escapeHTML: function(text){
            return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        },

        isMobileScreen: function(){
            return $(window).width() < 768;
        }
    };
})();