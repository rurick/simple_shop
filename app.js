'use strict';
const createError = require('http-errors'); //Создает ошибку http 
const express = require('express'); //Express JS framework
const path = require('path'); //для работы с путями файлов и диррикторий
const cookieParser = require('cookie-parser'); //для работы с кукис
const logger = require('morgan'); //для ведения журнала http запросов
const mongoose = require('mongoose'); //для обеспечения соединения и работы с СУБД mongo
const config = require('./config')(); //Конфигурационный файл для нашего сайта
const nunjucks = require('nunjucks'); //шаблонизатор

const indexRouter = require('./routes'); //роутер главной страницы сайта и карточки товара / и /item/XXX
const adminRouter = require('./routes/admin'); //роутер панели администрирования /admin
const basketRouter = require('./routes/basket'); //роутеер корзины покупок /basket
const accountRouter = require('./routes/account'); //роутер лк и авторизации /account
const orderRouter = require('./routes/order'); //роутер управления заказами /order
const yandexRouter = require('./routes/yandex'); //роутер платежной системы yandex /yandex

const session = require('express-session'); //для работы с сессиями пользователя https://github.com/expressjs/session
const MongoStore = require('connect-mongo')(session); //для хранения данных сессии в БД mongoo

const app = express(); //создаем приложение нашего сайта

//устанавливаем соединение с БД
mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/onlineshop', { 
		useUnifiedTopology: true , 
		useNewUrlParser: true,
	}, 
	//Т.к. наш сайт не работоспособен без БД , то всю дальнейшую работу и запуск http сервера пишем в функции обратного вызова соеддинения с БД
	// которая вызовится после установки соединения с БД
	function (err){
		if (err) {
			//Ошибка соединения с БД - завершить работу
			return console.log(err);
		}
		console.log('MongoDB runing at mongodb://' + config.mongo.host + ':' + config.mongo.port + '/onlineshop')

		//установим шаблонизатор по умолчанию
		app.set('view engine', 'nunjucks'); 
		//установим путь к шаблонам для шаблонизатора
		//https://mozilla.github.io/nunjucks/api.html#configure
		nunjucks.configure(path.join(__dirname, 'templates'), { 
			autoescape: true,
			express: app,
			watch: true
		});
		
		//вкличим журнал запросов
		app.use(logger('dev')); 
		//app.use(express.json());
		//app.use(express.urlencoded({ extended: false }));
		
		//указываем в какой дирректории лежит статика. 
		//Express на все запросы к файлам в этой дирректориии будет отвечить как файл-сервер - просто отдаст статический файл
		app.use(express.static(path.join(__dirname, 'public'))); 
		//включаем обработчик cookies
		app.use(cookieParser());
		
		//Запускаем обработку сессий 
		//В качестве хранилища для сессий установлена БД mongoo (используя текущее соедитнение с БД)
		//это middleware расширяет объект запроса добавляю туда данные сессии: req.session
		app.use(session({
			secret: 'onlineshopsecret',
			saveUninitialized: false,
			resave: false,
			store: new MongoStore({ mongooseConnection: mongoose.connection })
		}));
		
		//устанавливаем ассоциацию между начальной строкой запроса и роутером
		//внутри роутера мы указываем относительный путь
		//роутер обрабатывает запросы и передает их контроллерам
		app.use('/', indexRouter);
		app.use('/admin', adminRouter);
		app.use('/basket', basketRouter);
		app.use('/account', accountRouter);
		app.use('/order', orderRouter);
		app.use('/yandex', yandexRouter);
		
		// Обработка ошибки 404 - страница не найдена
		app.use(function(req, res, next) {
			next(createError(404));
		});
		
		// Обработчик ошибок
		app.use(function(err, req, res, next) {
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};
		
			// вывести ошибку пользователю
			res.status(err.status || 500);
			//тут указывается шаблон для вывода ошибки
			res.render('error.html');
		});
		

		//запускаем веб-сервер
		app.listen(config.port, ()=>{
			console.log('Server running at http://'+config.host+ ':' +config.port+' ...');
		})
	}
);

module.exports = app;
