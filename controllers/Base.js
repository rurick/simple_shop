'use strict'
// Базовый контроллер. От него наследуются остальеные
const User = require("../models/User");
const _ = require("underscore"); //мощная библиотека JS https://underscorejs.org/
module.exports = {
	name: "base",

	//расширяет функционал базового контроллера. Создает новый контроллер который включает в себя свойства и методы базового и расширения
	extend: function(child) {
		return _.extend({}, this, child);
	},

	//Middleware
	//проверить авторизацию и если ее нет, выполнит рудирект на ret
	// пользователь считается авторизированным если у него в сессии есть объект user 
	// и у него req.session.user.session_id == req.session.id
	_check_auth: function(req, res, next, ret) {
		if (! ( req.session.user && 
				req.session.user.session_id == req.session.id)) return res.redirect(ret);

		const user = User.get(req.session.user._id).then((u) => {
			if (u.session_id == req.session.id){
				req.is_auth = true;
				return next();
			} else {
				return res.redirect(ret);
			}
		});		
	},

	//Middleware 
	//проверка на аутентификацию
	//добавляет в объект запроса is_auth:Boolean
	is_auth: function(req, res, next){
		if (req.session.user && 
			req.session.user.session_id == req.session.id){
			req.is_auth = true;
		} else {
			req.is_auth = false;
		}		
		return next();
	},

	//уничтожить сессию пользователя
	do_logout: function(req){		
		if (req.session.user) {
			delete req.session.user;
			req.session.save();
			req.is_auth = false;
		}
	}
}