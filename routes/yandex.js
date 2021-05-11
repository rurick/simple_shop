'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: true});

const ya = require('../controllers/Yandex');

/* GET home page. */
router.get('/confirm', urlencodedParser, (req, res, next) => {
	ya.confirm(req, res, next);
});

module.exports = router;
