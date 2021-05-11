'use strict'
const express = require('express');
const router = express.Router();

const index = require('../controllers/Index');

/* GET home page. */
router.get('/', index.is_auth, (req, res, next) => {
	index.index(req, res, next);
});
router.get('/item/:id', index.is_auth, (req, res, next) => {
	index.item(req, res, next);
});

module.exports = router;
