const Sequelize = require('sequelize');

const sequelize = new Sequelize('accountlist', 'root', '12345678', {
	host: 'localhost',
	port: '3306',
	dialect: 'mysql'
});

(async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
})();

module.exports = {Sequelize, sequelize}