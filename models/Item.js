'use strict'
const _ = require("underscore");
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('autoIndex', true);

const ItemSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number, 
		required: true
	},
	description: String,
	short: String,
	available: {
		type: Boolean, 
		default: true,
		index: true
	},

	rubric: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Rubric'
	},

	parametrs: {

	}
});

var itemModel = mongoose.model('Item', ItemSchema);
var Item = _.extend(
	itemModel,
	{
		create: async function(itemData){
			const Rubric = require("../models/Rubric");
			itemData.rubric = await Rubric.get(itemData.rubric);
			var u = new itemModel(itemData);
			u = u.save();
			return u;
		},

		get: function(id){
			const u = this.findById(id);
			u.catch((e) => { throw("Item Id error"); });
			return u;
		},

		update: async function(itemData){
			let data = _.clone(itemData);
			const Rubric = require("../models/Rubric");
			data.rubric = await Rubric.get(data.rubric);
			return itemModel.where({_id: itemData._id}).updateOne(data).exec();
		},

		delete: function(itemData){
			let id = _.isString(itemData) ? itemData : itemData._id;
			return itemModel.deleteOne({_id: id}).exec();
		},

		all: function(){
			return this
			.find()
			.then( (objs) => {
				return Promise.resolve(objs);
			});
		}
	}
);

module.exports = Item;
