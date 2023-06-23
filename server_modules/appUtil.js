const server_logger = require("./serverLogger.js");
const _bDebug_mode = process.argv.indexOf("debug") >= 0;
const logger = server_logger.SERVER_LOGGING(__dirname + '/../logs/controller.log', { level: _bDebug_mode ? 'debug' : 'info' });


function safeJsonParse(json) {
  let parsed;
  try { parsed = JSON.parse(json); }
  catch (e) {
    logger.log("info", `safeJsonParse: ${e.message || e}`);
  }
  return parsed;
};


function amountParse(amt) {
  let parsed;
  try { parsed = parseFloat(amt); }
  catch (e) {
    logger.log("info", `amountParse: ${e.message || e}`);
  }
  return parsed;
};

module.exports = {
  safeJsonParse,
  amountParse
}