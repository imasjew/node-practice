const {Sequelize, sequelize} = require('./database.js')
const User = sequelize.define('user', {
	name: {
		type: Sequelize.STRING,
		validate: true
	},
	pswd: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: true
		}
	}
})

User.sync().then(() => {
	// return User.create({
	// 	firstName: 'John',
	// 	lastName: 'Hancock'
	// })
	console.log('表已同步')
})

module.exports = User