'use strict'
const BaseController = require("./Base");
const View = require("../views/Base");
const User = require("../models/User");
const Basket = require("./Basket");

//выззываем BaseController.extend  для расширения возможносте базового контроллера
module.exports = BaseController.extend({ 
	name: "Account",
    content: null,

    //Формирует ответ на GET  запрос
    //отображение страницы ЛК
	index: async function(req, res, next) {
        if (!req.is_auth) {
            return res.redirect('/account/login');
        }
        //Создали объект класса View, который является отображением и отправляет браузеру шаблон
        //в качестве параметра передается имя файла шаблона
        const v = new View(res, 'account.html'); 
        //req.session.user._id  хранится идентификатор пользователя(как в БД)
        //Обращаемся к модели User с просьбой получить пользователя по id
        const user = await User.get(req.session.user._id);
        //Передаём данные в представление для рендеринга шаблона
        v.render({
            req: req, //объект запроса
            user: user //объект пользователя
        });
    },
    
    //авторизация пользователя  - сохранение его данных в сессии
    run_login: async function(req, user){		
		req.session.user = {
			_id: user._id,
			name: user.name,
			email: user.email,
			is_admin: user.is_admin,
			session_id: req.session.id
		};
        req.session.save();
        //вызываем для обновления session_id в БД
		await User.update(req.session.user); 
    },    

    //Формирует ответ на GET  запрос
    //Отобразить страницу авторизации
    login: async function(req, res, next) {
        const v = new View(res, 'account_login.html');
        v.render({
            req: req
        });
    },

    //Формирует ответ на GET  запрос
    //отобразить страницу регистрации
    register: async function(req, res, next) {
        const v = new View(res, 'account_register.html');
        v.render({
            req: req
        });
    },
   
    //Формирует ответ на GET  запрос
    //Выход
	logout: function(req, res, next) {
		//завершает сессию пользователя 
        this.do_logout(req);
        //выполняет редирект на главную страницу
		res.redirect('/')
	},

    //обработка POST запроса
    do_register: async function(req, res, next) {
        if ( !req.body ) return response.sendStatus(400); //если нету данные в POST
        //выплним поиск существующего пользователя по email
		let user = await User.getByEmail(req.body.email);
        if ( user ) {
            //если пользователь найден сформируем ответ отобразив шаблон страницы регистрации 
            //с установленной переменной err  в контексте
            const v = new View(res, 'account_register.html');
            v.render({
                req: req,
                post: req.body,
                err: 1
            });
            return;    
        } 
        //соберем объект для передачи в модель
		const postData = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
        };
        //Создадим нового пользователя используя модель User
        user = await User.create(postData);
        //авторизируем пользователя
        await this.run_login(req, user);
        
        //Скажем корзине выполнить обновление. 
        //Это необходимо чтобы корзина изменила свои заказы с учетом авторизации пользователя
        await Basket.run_update(req.session.id, String(user._id));
        
         //если установлена переменная возврата ret  выполнить редирект по ней
         //т.е. страницу регистрации можно выполнить с указанием куда вернуться после регистрации
        if (req.query.ret && req.query.ret != '') {
            res.redirect(req.query.ret);
            return;
        }            
        
        //по умолчанию выполнить редирект на ЛК
        res.redirect('/account');
	},

    //обработка POST запроса
    //от формы авторизации пользователя
    do_login: async function(req, res) {		
		if ( !req.body ) return response.sendStatus(400); //если нету данные в POST
        
        //Просим модель проверить существует ли пользователь с такими email и password
        //Параметры POST  запроса доступны через req.body.*  благодаря работе middleware body-parser (см. в роутере)
		const user = await User.check({
			email: req.body.email, 
			password: req.body.password
		});
        if ( !user ) { 
            //нет совпадения емайл+пароль
            const v = new View(res, 'account_login.html');
            //если пользователь найден сформируем ответ отобразив шаблон страницы авторизации 
            //с установленной переменной err в контексте а данными из post запроса
            v.render({
                req: req,
                post: req.body,
                err: 1
            });
            return;    
        }

        //авторизуем пользователя
        this.run_login(req, user);

        //Скажем корзине выполнить обновление. 
        //Это необходимо чтобы корзина изменила свои заказы с учетом авторизации пользователя
        await Basket.run_update(req.session.id, String(user._id));
        
        //редирект на страницу ЛК
        return res.redirect('/account');
    }

});