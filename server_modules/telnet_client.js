const config = require(`../config/config.json`);
const server_logger = require("./server_logger.js");
const _bDebug_mode = process.argv.indexOf("debug") >= 0;
const logger = server_logger.SERVER_LOGGING(__dirname + '/../logs/controller.log', { level: _bDebug_mode ? 'debug' : 'info' });

const { Telnet } = require('telnet-client')

const PORT = config.tcp.pax_port;
const HOST = config.tcp.pax_ip;

async function run(msg) {
  let connection = new Telnet()

  // these parameters are just examples and most probably won't work for your use-case.
  let params = {
    host: HOST,
    port: PORT,
  }

  try {
    let connected = await connection.connect(params)
    console.log(connected)
    let res = await connection.write(msg)
    console.log('async result:', res)
  } catch (error) {
    // handle the throw (timeout)
  }

}


module.exports = { run };