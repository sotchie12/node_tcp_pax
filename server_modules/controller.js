const config = require(`../config/config.json`);
const server_logger = require("./server_logger.js");
const _bDebug_mode = process.argv.indexOf("debug") >= 0;
const logger = server_logger.SERVER_LOGGING(__dirname + '/../logs/controller.log', { level: _bDebug_mode ? 'debug' : 'info' });
const tcp_client = require('./tcp_client');
const { getCheckSum } = require('./sha256Util');

let saleResult = {};
let settleResult = {};


async function baseTest(req, res) {
    logger.log("info", `Base test received`)
    res.send({ test: "success" })
}

async function enquiryReceived(req, res) {
    try {
        res.json(saleResult)
    } catch (e) {
        logger.log("error", `saleReceived error: ${e.message || e}`);
        res.status(400).send({ code: 400, msg: "Request Failed" });
    }
}

async function saleReceived(req, res) {
    try {
        const obj = req.body
        const checkSum = await getCheckSum(`{"data":{"amt":"${obj.price}"},"dataType":"sale"}`)
        const salePayload = `{"checksum":"${checkSum}","data":{"amt":"${obj.price}"},"dataType":"sale"}`
        const client = new tcp_client();
        client.init(onSaleMessageReceived);
        client.sendMessage(`${salePayload}\r\n`);
        saleResult = {}

        res.send({ code: 200, msg: "success" })
    } catch (e) {
        logger.log("error", `saleReceived error: ${e.message || e}`);
        res.status(400).send({ code: 400, msg: "Request Failed" });
    }
}

async function settleReceived(req, res) {
    try {

        res.send({ code: 200, msg: "success" })
    } catch (e) {
        logger.log("error", `saleReceived error: ${e.message || e}`);
        res.status(400).send({ code: 400, msg: "Request Failed" });
    }
}


async function onSaleMessageReceived(data) {
    const resultStr = data.toString()
    const resultObj = safeJsonParse(resultStr)

    if (resultObj.dataType == "sale") {
        logger.log("info", `Received transaction details from server: ${resultStr}`);
        saleResult = resultObj;
    } else {
        logger.log("info", `Received message from server: ${data}`);
    }
}

async function onSettleMessageReceived(data) {
    const resultStr = data.toString()
    const resultObj = safeJsonParse(resultStr)

    logger.log("info", `Received settle message from server: ${data}`);

    if (resultObj.dataType == "settle") {

    }
}


function safeJsonParse(json) {
    let parsed;
    try { parsed = JSON.parse(json); }
    catch (e) {
        logger.log("info", `safeJsonParse: ${e.message || e}`);
    }
    return parsed;
};

module.exports = {
    baseTest,
    enquiryReceived,
    saleReceived,
    settleReceived,
};

