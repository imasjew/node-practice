const express = require('express');
const router = require('./router');
const app = express();
app.use('/', router);

const server = app.listen(8081, function () {
	var port = server.address().port
	console.log("服务启动于 http://%s:%s", 'localhost', port)
})
