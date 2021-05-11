'use strict'
const _ = require("underscore");
const BaseController = require("./Base");
const View = require("../views/Base");
const Order = require("../models/Order");
const Rubric = require("../models/Rubric");

module.exports = BaseController.extend({ 
	name: "AdminOrder",
	content: null,
	list: async function(req, res, next) {
		//вывод списка 
        const v = new View(res, 'admin/orders.html');
        const orders = await Order.all();
        v.render({
            page: 'orders',
            objects: orders,
            req: req
        });
    },
    
    get: async function(req, res, next) {
        const id = req.params.id;
        const v = new View(res, 'admin/order.html');
        v.render({
            page: 'orders',
            object: await Order.get(id),
            req: req,
            showdel: true,
        });
    },

    do_del: function (req, res, next) {
        const id = req.params.id;
        Order.delete(id);
        return res.redirect('/admin/orders');
    },

        
    do_edit: async function (req, res, next) {
        const id = req.params.id;
        const order = await Order.update(_.extend({}, {_id: id}, req.body))
        return res.redirect('/admin/orders/' + id);
    },
});