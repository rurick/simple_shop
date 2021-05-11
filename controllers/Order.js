'use strict'
const BaseController = require("./Base");
const View = require("../views/Base");
const User = require("../models/User");
const Basket = require("../models/Basket");
const Order = require("../models/Order");
const Item = require("../models/Item");


module.exports = BaseController.extend({ 
	name: "Order",
	content: null,

	check_auth: function(req, res, next) {
		//Middleware
		return BaseController._check_auth(req, res, next, '/account/register');
	},

	step1: async function(req, res, next) {
		if (!req.is_auth) return res.redirect('/account/register?ret=/order/confirm');
		const v = new View(res, 'order_confirm.html');
        const objects = await Basket.list(req.session.user._id);
        let sum = 0;
        for (var i=0; i < objects.length ; i++){
            let r = await Item.get(objects[i].item._id);
            if (r) objects[i].item_name = r.name;
            sum += objects[i].price * objects[i].cnt;
        }
		
        v.render({
            objects: objects,
            req: req,
            sum: sum
        });
	},

	do: async function(req, res, next) {
        const objects = await Basket.list(req.session.user._id);
        const user = await User.get(req.session.user._id);
        let items = [];
        let sum = 0;
        for (var i=0; i < objects.length ; i++){
            const it = await Item.get(objects[i].item._id);
            let it_name;
            if (!it) continue; //возможно между добавлдением в корзину и оформлением заказа прошло много времени и к этому моменту такого товара нет. Поэтому делаем эту проверку
            it_name = it.name;
            items.push({
                item_name: it_name,
                cnt: objects[i].cnt,
                price: objects[i].price,
                discount: objects[i].discount,
            });
            sum += objects[i].price * objects[i].cnt;
        }

        const order = await Order.create({
            user: user,
            items: items,
            sum: sum
        });

        await Basket.clear(user._id); //почистим корзину
		
        res.redirect('/order/' + order._id);
    },
    
    do_address: async function(req, res, next) {
        const id = req.params.id;
        const order = await Order.get(id);
        const address = req.body.address;
        Order.update({
            _id: id,
            address: address,
            status: 1
        });
        res.redirect('/order/' + order._id);
    },

	list: async function(req, res, next) {
        const user = await User.get(req.session.user._id);
		const v = new View(res, 'order_list.html');
		const orders = await Order.list(user);
		
        v.render({
            orders: orders,
            req: req
        });
    },
    
	get: async function(req, res, next) {
        //TODO задание - добавить проверку если заказа не существует
        const id = req.params.id;
        const order = await Order.get(id);
        let v;
        //в зависимости от статуса заказа
        switch (order.status){
            case 0:
                v = new View(res, 'order.html');
                break;
            case 1:
                v = new View(res, 'order_pay.html');
                break;
            default:
                v = new View(res, 'order_ok.html');
        }
        
		
        v.render({
            order: order,
            req: req
        });
	},

	
});