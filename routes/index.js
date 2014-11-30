var express = require('express');
var resourceBundle = require('./modules/resourceBundle');
var config = require('../config').config;
var router = express.Router();

var companies = require('../data/companies');

console.log(companies);

/* GET home page. */
router.get('/', function(req, res) {
    var labels = resourceBundle.getLabels(req);

    res.render('index', {
        title: labels.main_title,
        config: config,
        labels: labels,
        data: JSON.stringify(companies)
    });
});

module.exports = router;
