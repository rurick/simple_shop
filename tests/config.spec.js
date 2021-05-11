describe("Коцфигурация", function() {
	it("загружается конфигурация для local", function(next) {
		var config = require('../config')();
		expect(config.mode).toBeDefined();
		expect(config.port).toBeDefined();
		expect(config.mongo).toBeDefined();
		expect(config.mode).toBe('local');
		expect(config.host).toBe('localhost');
		next();
	});
	it("закгружается конфигурация для production", function(next) {
		var config = require('../config')('production');
		expect(config.mode).toBeDefined();
		expect(config.port).toBeDefined();
		expect(config.host).toBeDefined();
		expect(config.mongo).toBeDefined();
		expect(config.mode).toBe('production');
		next();
	});
});