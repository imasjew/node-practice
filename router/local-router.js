
const express = require('express');
const router = express.Router();
const fs = require("fs");

router.use(express.json())
router.use(express.urlencoded({ extended: false }))
const accountFileLocation = "account-list.json"

router.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
})

router.post('/register', async (req, res) => {
	const newAccount = {
		name: req.body.name,
		pswd: req.body.pswd
	}
	let accountFile;
	try {
		accountFile = await getAccount(); // 获取账户列表
	} catch (errData) {
		return res.status(403).send({message: errData});
	}
	// 查验账号是否合规
	if (checkDuplication(accountFile.accounts, newAccount)) {
		return res.status(403).send({message: '账号已存在'});
	}
	if (checkName(newAccount.name)) {
		return res.status(403).send({message: '账号不合规'});
	}
	if (checkPswd(newAccount.pswd)) {
		return res.status(403).send({message: '密码不合规'});
	}
	// 通过查验，加入
	const resultList = dealList(accountFile, newAccount);
	try {
		await setAccount(resultList)
		res.status(200).send('注册成功')
	} catch {
		res.status(403).send({message: '服务器异常'})
	}
})
router.post('/login', async (req, res) => {
	const newAccount = {
		name: req.body.name,
		pswd: req.body.pswd
	}
	let accountFile;
	try {
		accountFile = await getAccount(); // 打开用户表
	} catch (errData) {
		return res.status(403).send({message: errData});
	}
	const accountResult = findAccount(accountFile.accounts, newAccount);
	switch (accountResult) {
		case 0:
			return res.status(200).send('server登录成功');
		case 1:
			return res.status(403).send({message: '密码错误'});
		case 2:
			return res.status(403).send({message: '用户不存在，请注册'});
		default:
			return res.status(403).send({message: '服务器异常'});
	}
})

function getAccount() {
	return new Promise((resolve, reject) => {
		fs.readFile(accountFileLocation, function (err, data) {
			if (!err) {
				let accountFile
				// 以下判断写着玩尝试不同处理效果，逻辑不严谨
				try {
					accountFile = JSON.parse(data);
				} catch {
					// json解析失败,直接重置文件
					accountFile = { accounts: [] }
				}
				if (!(accountFile.accounts instanceof Array)) {
					// 读取失败(json数组格式损坏)
					reject('注册失败');
				} else {
					resolve(accountFile);
				}
			} else {
				// 读取失败(无法打开文件)
				reject('注册失败')
			}
		})
	})
}
function checkDuplication(listData, newAccount) {
	for (let i in listData) {
		if (listData[i].name === newAccount.name) {
			return true;
		}
	}
	return false;
}
function findAccount(listData, newAccount) {
	for (let i in listData) {
		if (listData[i].name == newAccount.name) {
			if (listData[i].pswd == newAccount.pswd) {
				return 0;
			} else {
				return 1;
			}
		}
		if (i == listData.length - 1) {
			return 2;
		}
	}
}
function dealList(accountFile, newAccount) {
	accountFile.accounts.push(newAccount);
	return accountFile;
}
function setAccount(resultList) {
	return new Promise((resolve, reject) => {
		fs.writeFile(accountFileLocation, JSON.stringify(resultList), function (err) {
			if (!err) {
				resolve('写入成功')
			} else {
				reject('写入失败', err)
			}
		})
	})
}
function checkName(name) {
	return false
}
function checkPswd(pwsd) {
	return false
}

module.exports = router;