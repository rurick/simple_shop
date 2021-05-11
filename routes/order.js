'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: true});

const order = require('../controllers/Order');

router.get('/confirm', order.is_auth, (req, res, next) => {
	order.step1(req, res, next);
});
router.get('/do', order.check_auth, (req, res, next) => {
	order.do(req, res, next);
});
router.get('/list', order.check_auth, (req, res, next) => {
	order.list(req, res, next);
});
router.post('/address/:id', urlencodedParser, order.check_auth, (req, res, next) => {
	order.do_address(req, res, next);
});
router.get('/:id', order.check_auth, (req, res, next) => {
	order.get(req, res, next);
});

module.exports = router;
