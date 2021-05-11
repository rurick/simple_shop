'use strict'
const BaseController = require("./Base");
const View = require("../views/Base");
const Item = require("../models/Item");


module.exports = BaseController.extend({ 
	name: "Index",
	content: null,
	index: async function(req, res, next) {
		const v = new View(res, 'index.html');
        const items = await Item.all();
        v.render({
            items: items,
            req: req
        });
	},

    item: async function(req, res, next) {
        const id = req.params.id;
        const v = new View(res, 'item.html');
        v.render({
            item: await Item.get(id),
            req: req
        });
	},

});