var config = require('../config')();
const mongoose = require('mongoose');


describe("MongoDB", function() {
	it("запущен ли сервер", function(next) {
		mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/onlineshop', { 
			useUnifiedTopology: true , 
			useNewUrlParser: true,
		}, function (err){
			expect(err).toBe(null);
			next();
		});
	});
});