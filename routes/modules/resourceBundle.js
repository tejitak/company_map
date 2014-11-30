var fs = require('fs');

var SUPPORT_LANGS = {
    "ja": true
};

// {"default": {...}, "ja": {...}}
var _resources = {};

var loadNLS = function(lang){
    var dir = lang ? "/" + lang : "";
    fs.readFile('./nls' + dir + '/resources.json', 'UTF-8', function (err, data) {
        if (err){ throw err; }
        _resources[lang || "default"] = JSON.parse(data);
    });
};

// load default nls
loadNLS("");
// load each nls
for(var name in SUPPORT_LANGS){
    if(name && SUPPORT_LANGS[name]){
        loadNLS(name);
    }
}

var resourceBundle = {

    getLocale: function(req){
        var languageHeader = req.headers['accept-language'], languages = [], locale = "";
        if (languageHeader) {
            languageHeader.split(',').forEach(function(l){
                var header = l.split(';', 1)[0], lr = header.split('-', 2);
                if (lr[0]) {
                    languages.push(lr[0].toLowerCase());
                }
            });
            if (languages.length > 0) {
                locale = languages[0];
            }
        }
        return locale;
    },

    getLabels: function(req){
        var locale = this.getLocale(req);
        var isSupported = SUPPORT_LANGS[locale];
        return isSupported ? _resources[locale] : _resources["default"]
    }
};

module.exports = resourceBundle;
