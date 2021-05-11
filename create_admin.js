'use strict';
const mongoose = require('mongoose');
const config = require('./config')();

mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/onlineshop', { 
	useUnifiedTopology: true , 
	useNewUrlParser: true,
}, async function (err){
	if (err) {return console.log(err);}
	const User = require('./models/User');
	var u = {
		name: 'admin',
		email: 'admin@admin',
		password: 'admin',
		is_admin: true
	};
	u = await User.create(u)
	console.log(u);

});