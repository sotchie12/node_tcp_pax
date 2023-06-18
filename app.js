const express = require('express');
const bodyParser = require('body-parser');
const config = require(`./config/config.json`);
const router = require('./routes/route');
const server_logger = require("./server_modules/server_logger.js");
const _bDebug_mode = process.argv.indexOf("debug") >= 0;
const logger = server_logger.SERVER_LOGGING(__dirname + '/logs/controller.log', { level: _bDebug_mode ? 'debug' : 'info' });
//const controller = require('./server_modules/controller.js');


const app = express();

app.use(router);
app.use(bodyParser.json(config.json_upload_limit))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//let main = async () => {
//};

module.exports = app;

//main();

app.listen(config.express_port, function () {
    logger.log(`info`, `Application is listening on port: [${config.express_port}]`);
});