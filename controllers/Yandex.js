'use strict'
const BaseController = require("./Base");
const Order = require("../models/Order");
const config = require('../config')();

module.exports = BaseController.extend({ 
	name: "Yandex",
	content: null,
	//POST - подтверждение оплаты от платежной системы
	confirm: async function(req, res, next) {
		const id = req.body.label;
		const test = [
			req.body.notification_type, 
			req.body.operation_id,
			req.body.amount,
			req.body.currency,
			req.body.datetimem,
			req.body.sender,
			req.body.codepro,
			config.payments.yandex.secret,
			req.body.label
		];
		const crypto = require('crypto');
		const shasum = crypto.createHash('sha1');
		shasum.update(test.join('&'));
		//проверка подленности запроса
		if (shasum.digest('hex') !== req.body.sha1_hash){
			return res.sendStatus(400);
		}
		//возмём оплаченый заказ
		const order = await Order.get(id);
		//на всякий случай проверили что сумма платежа равна сумме заказа
		if (parseInt(order.sum) == parseInt(req.body.amount)){			
			//переведем его статус в "Ожидает отправку"
			Order.update({
				_id: id,
				status: 2
			});
		} else {
			//неверная цена. Возможно попытка взлома. Вернём ошибку
			return res.sendStatus(300);
		}
		//Вернём код 200 как требует платежная система в случае успеха
        return res.sendStatus(200);
	},
});