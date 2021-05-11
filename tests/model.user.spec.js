'use strict'
const mongoose = require('mongoose');

var config = require('../config')();

describe("Модель User", function() {
	it("пользователь", function(next) {
		var User = require('../models/User');
		var user = User({
			name: 'test',
			password: '0',
			email: 'email',
			session_id: 'short',
			isAdmin	: false
		});
		next();
	});
});
