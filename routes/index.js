var express = require('express');
var resourceBundle = require('./modules/resourceBundle');
var config = require('../config').config;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var labels = resourceBundle.getLabels(req);
    res.render('index', {
        title: labels.main_title,
        config: config,
        labels: labels
    });
});

module.exports = router;
