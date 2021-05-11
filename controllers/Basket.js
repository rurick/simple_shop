'use strict'
const BaseController = require("./Base");
const View = require("../views/Base");
const Item = require("../models/Item");
const Basket = require("../models/Basket");
const User = require("../models/User");


module.exports = BaseController.extend({ 
	name: "Basket",
	content: null,

	//Обновить свою корзину поменяв session_id  на user_id.
	//--
	//неавторизваный пользователь хранит покупке в корзине по своему идентификатору сессии, 
	//а авторизованый по идентификатору пользователя
	//если пользователь сначал сделал покупки в корзину а потом авторизовался, 
	//чтобы сохранить за ним его покупки запускается эта функция
	run_update: async function(sess_id, user_id){
		await Basket.updateMany({user: sess_id}, {user: user_id, user_type: 1}).exec();
	},
	
	//добавить в корзину
	do_basket_add: async function (req, res, next) {
		const id = req.params.id;
		const item = await Item.get(id);
		const u = req.is_auth ? req.session.user._id : req.session.id; 
		const user_type = req.is_auth ? 1 : 0; 

		let basket = await Basket.find_by_item(item, u);
		if (basket.length == 0) {
			basket = await Basket.create({
				user: u,
				user_type: user_type,
				item: item,
				cnt: 1,
				price: item.price
			});	
		} else {
			basket[0].cnt += 1;
			basket = await Basket.update(basket[0]);
		}
		
		res.redirect('/basket/');
		return basket;
	},
	
	//добавить в корзину
	do_basket_del: async function (req, res, next) {
		const id = req.params.id;
		let basket = await Basket.get(id);
		if (basket && 
			(req.is_auth && basket.user == req.session.user._id || !req.is_auth && basket.user == req.session.id)) { //дополнительная проверка что удаляю из своей корзины
			Basket.delete(id);
		}
		
		res.redirect('/basket/');
		return basket;
	},

	list: async function(req, res, next) {
		const u = req.is_auth ? req.session.user._id : req.session.id;
        const v = new View(res, 'basket.html');
		const objects = await Basket.list(u);
        for (var i=0; i < objects.length ; i++){
            let r = await Item.get(objects[i].item._id);
            if (r) objects[i].item_name = r.name;
        }
		
        v.render({
            objects: objects,
            req: req
        });

	},
});