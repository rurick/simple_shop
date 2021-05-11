module.exports = function(response, template) {
	this.response = response;
	this.template = template;
};

const _ = require("underscore");
module.exports.prototype = {
	extend: function(child) {
		return _.extend({}, this, child);
	},
	render: function(data) { 
		//выполним рендер шаблона подставив контекст data и отдадим его в ответ response
		if(this.response && this.template) {
			this.response.render(this.template, data);
		}
	}
}