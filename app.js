const express = require('express');

// const localRouter = require('./router/local-router');
const dbRouter = require('./router/db-router');

require('./database/database')
require('./database/User')
const app = express();

// app.use('/', localRouter);
app.use('/', dbRouter)

const server = app.listen(8081, function () {
	var port = server.address().port
	console.log("服务启动于 http://%s:%s", 'localhost', port)
})
