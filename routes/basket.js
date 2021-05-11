'use strict'
const express = require('express');
const router = express.Router();

const basket = require('../controllers/Basket');

router.get('/add/:id', basket.is_auth, (req, res, next) => {
	basket.do_basket_add(req, res, next);
});
router.get('/del/:id', basket.is_auth, (req, res, next) => {
	basket.do_basket_del(req, res, next);
});
router.get('/', basket.is_auth, (req, res, next) => {
	basket.list(req, res, next);
});
module.exports = router;
