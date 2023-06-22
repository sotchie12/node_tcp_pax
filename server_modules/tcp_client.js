const config = require(`../config/config.json`);
const server_logger = require("./server_logger.js");
const _bDebug_mode = process.argv.indexOf("debug") >= 0;
const logger = server_logger.SERVER_LOGGING(__dirname + '/../logs/controller.log', { level: _bDebug_mode ? 'debug' : 'info' });

const net = require('net');

const PORT = config.tcp.pax_port;
const HOST = config.tcp.pax_ip;

class Client {
    constructor(port, address) {
        this.socket = new net.Socket();
        this.address = address || HOST;
        this.port = port || PORT;
    }

    init(onMessage) {
        var client = this;
        client.socket.connect(client.port, client.address, () => {
            logger.log("info", `Client connected to: ${client.address} :  ${client.port}`);
        });

        client.socket.on('data', onMessage);

        client.socket.on('close', () => {
            logger.log("info", 'Client closed');
        });
    }

    sendMessage(message) {
        var client = this;
        client.socket.write(message);
    }
}
module.exports = Client;