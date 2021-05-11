'use strict'
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: true});

const admin = require('../controllers/Admin');
const adminUsers = require('../controllers/Admin.Users');
const adminRubrics = require('../controllers/Admin.Rubrics');
const adminOrders = require('../controllers/Admin.Orders');
const adminItems = require('../controllers/Admin.Items');

//корень админки
router.get('/', admin.is_auth, (req, res, next) => {
	if (req.is_auth) {
		admin.index(req, res, next)
	} else {
		admin.login(req, res, next)
	}	
});
router.post('/', urlencodedParser, (req, res, next) => {
	admin.do_login(req, res, next)
});

//выйти
router.get('/logout', (req, res, next) => {
	admin.logout(req, res, next)
});

//Users
router.get('/users', admin.check_auth, (req, res, next) => {
	adminUsers.list(req, res, next);
});
router.get('/users/add', admin.check_auth, (req, res, next) => {
	adminUsers.add(req, res, next);
});
router.get('/users/:id', admin.check_auth, (req, res, next) => {
	adminUsers.get(req, res, next);
});
router.get('/users/del/:id', admin.check_auth, (req, res, next) => {
	adminUsers.do_del(req, res, next);
});
router.post('/users/add', urlencodedParser, admin.check_auth, (req, res, next) => {
	adminUsers.do_add(req, res, next);
});
router.post('/users/:id', urlencodedParser, admin.check_auth, (req, res, next) => {
	adminUsers.do_edit(req, res, next);
});

//Rubrics
router.get('/rubrics', admin.check_auth, (req, res, next) => {
	adminRubrics.list(req, res, next);
});
router.get('/rubrics/add', admin.check_auth, (req, res, next) => {
	adminRubrics.add(req, res, next);
});
router.get('/rubrics/:id', admin.check_auth, (req, res, next) => {
	adminRubrics.get(req, res, next);
});
router.get('/rubrics/del/:id', admin.check_auth, (req, res, next) => {
	adminRubrics.do_del(req, res, next);
});
router.post('/rubrics/add', urlencodedParser, admin.check_auth, (req, res, next) => {
	adminRubrics.do_add(req, res, next);
});
router.post('/rubrics/:id', urlencodedParser, admin.check_auth, (req, res, next) => {
	adminRubrics.do_edit(req, res, next);
});

//Items
router.get('/items', admin.check_auth, (req, res, next) => {
	adminItems.list(req, res, next);
});
router.get('/items/add', admin.check_auth, (req, res, next) => {
	adminItems.add(req, res, next);
});
router.get('/items/del/:id', admin.check_auth, (req, res, next) => {
	adminItems.do_del(req, res, next);
});
router.get('/items/:id', admin.check_auth, (req, res, next) => {
	adminItems.get(req, res, next);
});
router.post('/items/add', urlencodedParser, admin.check_auth, (req, res, next) => {
	adminItems.do_add(req, res, next);
});
router.post('/items/:id', urlencodedParser, admin.check_auth, (req, res, next) => {
	adminItems.do_edit(req, res, next);
});

//Orders
router.get('/orders', admin.check_auth, (req, res, next) => {
	adminOrders.list(req, res, next);
});
router.get('/orders/del/:id', admin.check_auth, (req, res, next) => {
	adminOrders.do_del(req, res, next);
});
router.get('/orders/:id', admin.check_auth, (req, res, next) => {
	adminOrders.get(req, res, next);
});
router.post('/orders/:id', urlencodedParser, admin.check_auth, (req, res, next) => {
	adminOrders.do_edit(req, res, next);
});


module.exports = router;
