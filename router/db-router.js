const express = require('express');
const User = require('../database/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const cors = require('cors')

const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
})
router.use(cors({
	exposeHeaders: ['Authorization']
}))

router.post('/register', async (req, res) => {
	const { name, pswd } = req.body
	const account = await User.findOne({ where: { name } })
	if (account) {
		return res.status(403).send({ message: '账号已存在' });
	}
	await User.create({ name, pswd: bcrypt.hashSync(pswd, 5) })
	res.status(200).send('注册成功')
})

router.post('/login', async (req, res) => {
	const { name, pswd } = req.body
	const account = await User.findOne({ where: { name } })
	if (!account) {
		return res.status(403).send({ message: '用户不存在，请注册' });
	}
	const pswdValid = bcrypt.compareSync(pswd, account.dataValues.pswd)
	if (!pswdValid) {
		return res.status(403).send({ message: '密码错误' });
	}
	const token = jwt.sign({ name }, "qwer")
	res.status(200).send({ token });
})

router.post('/auth', async (req, res) => {
	try {
		const token = String(req.headers.authorization).split(' ').pop()
		const { name } = jwt.verify(token, "qwer")
		const account = await User.findOne({ where: { name } })
		if (!account) {
			return res.status(403).send({ message: 'token错误, 请注册' });
		}
		return res.status(200).send({ message: 'token校验通过' });
	} catch {
		return res.status(403).send({ message: 'token错误, 请注册' });
	}



})

module.exports = router