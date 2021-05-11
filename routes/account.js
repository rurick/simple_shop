'use strict'
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: true});

const account = require('../controllers/Account');

//отбрасываем часть usrl которая привела нас в этот роутер, а именно /account
//анализируем дальнейшую часть url  и передаем управление подходящему контроллеру


router.get('/', account.is_auth, (req, res, next) => {
	account.index(req, res, next);
});

router.get('/login', account.is_auth, (req, res, next) => {
	account.login(req, res, next);
});
router.post('/login', urlencodedParser, account.is_auth, (req, res, next) => {
	account.do_login(req, res, next);
});
router.get('/logout', account.is_auth, (req, res, next) => {
	account.logout(req, res, next);
});

router.get('/register', (req, res, next) => {
	account.register(req, res, next);
});
router.post('/register', urlencodedParser, (req, res, next) => {
	account.do_register(req, res, next);
});

module.exports = router;
