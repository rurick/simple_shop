'use strict'
const mongoose = require('mongoose');
var config = require('../config')();

describe("Модель Item", function() {
	it("товар", function(next) {
		var Item = require('../models/Item');
		var test = Item({
			name: 'test',
			price: 1000,
			description: 'description',
			short: 'short',
			available: false
		});
		next();
	});
});