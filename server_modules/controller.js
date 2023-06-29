const config = require(`../config/config.json`);
const server_logger = require("./serverLogger.js");
const _bDebug_mode = process.argv.indexOf("debug") >= 0;
const logger = server_logger.SERVER_LOGGING(__dirname + '/../logs/controller.log', { level: _bDebug_mode ? 'debug' : 'info' });
const tcp_client = require('./tcpClient');
const { getCheckSum } = require('./sha256Util');
const appUtils = require('./appUtil');

let saleResult = {};
let settleResult = {};
let client = null;

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
        const checkSum = await getCheckSum(`{"data":{"amt":"${appUtils.amountParse(obj.price) * 100}"},"dataType":"sale"}`)
        const salePayload = `{"checksum":"${checkSum}","data":{"amt":"${appUtils.amountParse(obj.price) * 100}"},"dataType":"sale"}`
        client = new tcp_client();
        client.init(onSaleMessageReceived);
        client.sendMessage(`${salePayload}\r\n`);
        saleResult = {}

        res.send({ code: 200, msg: "sale received" })
    } catch (e) {
        logger.log("error", `saleReceived error: ${e.message || e}`);
        res.status(400).send({ code: 400, msg: "Request Failed" });
    }
}

async function settleReceived(req, res) {
    try {
        const checkSum = await getCheckSum(`{"data":{"acqName":"${config.settle.acqname}","Pwd":"${config.settle.pwd}"},"dataType":"settle"}`)
        const settlePayload = `{"checksum":"${checkSum}","data":{"acqName":"${config.settle.acqname}","Pwd":"${config.settle.pwd}"},"dataType":"settle"}`
        client = new tcp_client();
        client.init(onSettleMessageReceived);
        client.sendMessage(`${settlePayload}\r\n`);
        settleResult = {};

        res.send({ code: 200, msg: "settlement in process" })
    } catch (e) {
        logger.log("error", `saleReceived error: ${e.message || e}`);
        res.status(400).send({ code: 400, msg: "Request Failed" });
    }
}

async function onSaleMessageReceived(data) {
    try {
        const resultStr = data.toString()
        const resultObj = appUtils.safeJsonParse(resultStr)

        if (resultObj.dataType == "sale") {
            logger.log("info", `Received sale transaction details from server: ${resultStr}`);
            saleResult = resultObj;
            client.sendMessage(`{"dataType":"ack"\r\n`);
        } else {
            logger.log("info", `Received sale message from server: ${data}`);
        }
    } catch (e) {
        logger.log("error", `onSaleMessageReceived error: ${e.message || e}`);
    }
}

async function onSettleMessageReceived(data) {
    try {
        const resultStr = data.toString()
        const resultObj = appUtils.safeJsonParse(resultStr)

        if (resultObj.dataType == "settle") {
            logger.log("info", `Received settle transaction details from server: ${resultStr}`);
            saleResult = resultObj;
            client.sendMessage(`{"dataType":"ack"}\r\n`);
        } else {
            logger.log("info", `Received settle message from server: ${data}`);
        }
    } catch (e) {
        logger.log("error", `onSaleMessageReceived error: ${e.message || e}`);
    }
}

module.exports = {
    baseTest,
    enquiryReceived,
    saleReceived,
    settleReceived,
};