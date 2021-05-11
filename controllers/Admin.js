'use strict'
const BaseController = require("./Base");
const View = require("../views/Base");
const User = require("../models/User");

module.exports = BaseController.extend({ 
	name: "Admin",
	content: null,
	//Middleware
	check_auth: function(req, res, next) {		
		//вызов _check_auth  базового контроллера с указанием страницы для редиректа 
		//TODO
		//авторизован, но проверим что пользователь админ. Вдруг он зашел просто на сайте и пытается пойти в админку
		return BaseController._check_auth(req, res, next, '/admin');
	},

	//GET - главная страница
	index: function(req, res, next) {
		if (!req.is_auth){
			return res.redirect("/admin?err=1");
		}
		const user = User.get(req.session.user._id);
		const v = new View(res, 'admin/index.html');
		v.render({
			req: req, 
			user: user
		});
	},

	//GET - страница авторизации админки
	login: function(req, res, next) {		
		const v = new View(res, 'admin/login.html');
		v.render({req: req}); //если была ошибка авторизации то в запросе будет передано err=X
	},

	//GET - страница выхода из админки
	logout: function(req, res, next) {
		//выход
		this.do_logout(req);
		res.redirect('/admin')
	},

	//POST - произвести авторизацию
	do_login: async function (req, res, next) {
		if ( !req.body ) return res.sendStatus(400); //если нету данные в POST
		
		const user = await User.check({
			email: req.body.email,
			password: req.body.password
		});
		if ( !user ) return res.redirect('/admin?err=1'); //нет совпадения емайл+пароль

		if ( !user.is_admin ) return res.redirect('/admin?err=2'); //пользователь не админ

		//сохраним данные пользователья в сессии
		req.session.user = {
			_id: user._id,
			name: user.name,
			email: user.email,
			is_admin: user.is_admin,
			session_id: req.session.id
		};
		req.session.save();
		await User.update(req.session.user);

		return res.redirect('/admin');
	},

	
});