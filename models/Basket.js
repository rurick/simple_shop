'use strict'
const _ = require('underscore');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('autoIndex', true);
const Item = require("./Item");


const BasketSchema = mongoose.Schema({
	user: {
		type: String, //может быть идентификатором пользователя или сессии
		index: true
	},
	user_type: Number, //0 - неавторизированый, 1 - авторизированый
	item: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Item'
	},
	cnt: Number,
	price: Number,
	discount: {type: Number, default: 0}
});

var basketModel = mongoose.model('Basket', BasketSchema);
var Basket = _.extend(
	basketModel,
	{
		create: async function(data){
			data.item = await Item.get(data.item);
			var u = new basketModel(data);
			u = u.save();
			return u;
		},

		get: function(id){
			const u = this.findById(id);
			u.catch((e) => { throw("Basket Id error"); });
			return u;
		},

		//найти запись по item
		find_by_item: function(item, user_id){
			return this
			.find({user:String(user_id), item: item}).exec()
			.then( (objs) => {
				return Promise.resolve(objs);
			});
		},

		update: async function(data){
			return this.where({_id: data._id}).updateOne(data).exec();
		},

		delete: function(data){
			let id = _.isString(data) ? data : data._id;
			return this.deleteOne({_id: id}).exec();
		},


		clear: function(user_id){
			return this
			.deleteMany({user: String(user_id)}).exec()
			.then( (objs) => {
				return Promise.resolve(objs);
			});
		},

		list: function(user_id){
			return this
			.find({user: String(user_id)}).exec()
			.then( (objs) => {
				return Promise.resolve(objs);
			});
		}
	}
);
module.exports = Basket;
