const config = require(`../config/config.json`);
const server_logger = require("./server_logger.js");
const _bDebug_mode = process.argv.indexOf("debug") >= 0;
const logger = server_logger.SERVER_LOGGING(__dirname + '/../logs/controller.log', { level: _bDebug_mode ? 'debug' : 'info' });
const tcp_client = require('./tcp_client');
const { getCheckSum } = require('./sha256Util');

let paymentResult = {}

async function baseTest(req, res) {
    logger.log("info", `Base test received`)
    res.send({ test: "success" })
}

async function saleReceived(req, res) {
    try {
        const obj = req.body

        let saleObj = {
            data: { amt: obj.price },
            dataType: "sale"
        }

        const checkSum = await getCheckSum(JSON.stringify(saleObj))

        saleObj.checksum = checkSum

        logger.log("info", `saleObj: ${JSON.stringify(saleObj)}`)
        const client = new tcp_client();
        client.sendMessage(JSON.stringify(saleObj))

        //client.sendMessage("{\"checksum\":\"00671fb929f3103b419c56c410e4a1d383d17e9949660143185a95a4022ff298\",\"data\":{\"amt\":\"6560\",\"detail\":\"Y\",\"ecrRef\":\"TXN019600223022143009970\"},\"dataType\":\"sale\"}")

        res.send({ code: 200, msg: "success" })
    } catch (e) {
        logger.log("error", `saleReceived error: ${e.message || e}`);
        res.status(400).send({ code: 400, msg: "Request Failed" });
    }
}


module.exports = {
    baseTest,
    saleReceived
};

