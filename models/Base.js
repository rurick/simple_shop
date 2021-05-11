//Этот модуль не используется
/** TODO оформить библиотекой и пройтись по нему автокоментариями
 * унаследовать от него все модели
 * и отразить в методичке
 * */

'use strict'
var _ = require("underscore");

module.exports = {
	name: name,
	Model: mongoose.model(name, Schema),

	extend: function(child) {
		return _.extend({}, this, child);
	},

	get: function(id){
		const u = this.findById(id);
		u.catch((e) => {
			throw("Id error");
		});
		return u;
	},

	update: function(data){
		return Model.where({_id: data._id}).update(data).exec();
	},

	delete: function(data){
		let id = _.isNumber(data) ? data : data._id;
		return Model.deleteOne({_id: id});
	}
}


