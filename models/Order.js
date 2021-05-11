'use strict'
const _ = require('underscore');
const mongoose = require('mongoose');
const User = require('./User');
mongoose.set('useCreateIndex', true);
mongoose.set('autoIndex', true);

const OrderSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User' ,
		index: true
	},
	items: [],
	address: {
		type: String,
		default: ''
	},
	status: { //'0': "Подтверждение...", '1': "Ожидает оплаты", '2': "Ожидает отправки", , '3': "Отправлен"
		type: Number,
		default: 0
	},
	comment: {
		type: String,
		default: ''
	},
	sum: Number,
	date: {
		type: Date,
		default: Date.now
	}
});

var orderModel = mongoose.model('Order', OrderSchema);
var Order = _.extend(
	orderModel,
	{
		create: async function(data){
			const User = require("./User");
			data.user = await User.get(data.user._id);
			var u = new orderModel(data);
			u = u.save();
			return u;
		},

		get: function(id){
			const u = this.findById(id);
			u.catch((e) => { throw("Order Id error"); });
			return u;
		},

	
		update: async function(data){
			return this.where({_id: data._id}).updateOne(data).exec();
		},

		delete: function(data){
			let id = _.isString(data) ? data : data._id;
			return this.deleteOne({_id: id}).exec();
		},

		all: function(user){
			return this
			.find()
			.then( async (objs) => {
				for (let i = 0; i < objs.length; i++) {
					const u = await User.get(objs[i].user);
					objs[i].username = u.name;
				}
				return Promise.resolve(objs);
			});
		},

		list: function(user){
			return this
			.find({user: user}).exec()
			.then( (objs) => {
				return Promise.resolve(objs);
			});
		}
	}
);
module.exports = Order;