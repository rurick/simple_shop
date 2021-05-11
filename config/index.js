//При запуске приложения можем передать ему в качестве параметра конфигурацию
//например node app.js production
//исходя из этого будет выбрана конфигурация сервера (по умолчанию это local)
var config = {
	local: {
		mode: 'local', //имя конфигурации
		host: 'localhost', //хост сервера
		port: 3000, //http порт сервера
		payments: { //настройки платёжной системы
			yandex: {
				secret : 'xxxxxxxxxxxxxxxxxxx' //секретный код 
			}
		},
		mongo: {
			host: '127.0.0.1', //хост базы данных
			port: 27017, //порт базы данных
		}
	},
	production: {
		mode: 'production',
		host: 'localhost',
		port: 5000,
		payments: {
			'yandex': {
				secret : 'xxxxxxxxxxxxxxxxxxx'
			}
		},
		mongo: {
			host: '127.0.0.1',
			port: 27017
			//user: 'username',
			//pass: 'pswd'
		}
	}
}
module.exports = function(mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
}