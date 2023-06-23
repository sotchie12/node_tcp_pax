const winston = require('winston');
const server_config = require(`../config/config.json`);

require("winston-daily-rotate-file");

let log_obj = {};

module.exports = {
    SERVER_LOGGING: function(file_path, option) {
        if (!option) { option = {}; }
        if (!option.level) { option.level = 'info'; }
        log_obj = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.label({ label: process.pid }),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.DailyRotateFile({
                    level: option.level,
                    filename: file_path,
                    datePattern: undefined, 
                    handleExceptions: true,
                    maxsize: server_config.log_options._iLOG_FILE_MAXSIZE, 
                    maxFiles: server_config.log_options._iLOG_FILE_COUNT,
                }),
                new winston.transports.Console({
                    level: option.level,
                    handleExceptions: true,
                })
            ],
            exitOnError: false
        });
        return log_obj;
    },
    log_obj: log_obj
};