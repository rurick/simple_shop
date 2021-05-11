'use strict'
const _ = require("underscore");
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('autoIndex', true);
const RubricSchema = mongoose.Schema({
	name: String,
});

var rubricModel = mongoose.model('Rubric', RubricSchema);
var Rubric = _.extend(
	rubricModel,
	{
		create: function(rubricData){
			var u = new rubricModel(rubricData);
			u = u.save();
			return u;
		},

		get: function(id){
			const u = this.findById(id);
			u.catch((e) => { throw("Rubric error"); });
			return u;
		},

		update: function(rubricData){
			let data = _.clone(rubricData);
			return rubricModel.where({_id: rubricData._id}).updateOne(data).exec();
		},

		delete: function(rubricData){
			let id = _.isString(rubricData) ? rubricData : rubricData._id;
			return rubricModel.deleteOne({_id: id}).exec();
		},

		all: function(){
			return this
			.find();
		}
	}
);

module.exports = Rubric;
