// Dependencies
const chalk = require("chalk");
const moment = require("moment");
const config = require("../config.js");
const log = require("simple-node-logger").createRollingFileLogger({
  logDirectory: "./src/logs",
  fileNamePattern: "roll-<DATE>.log",
  dateFormat: "YYYY.MM.DD",
});

// Logger
exports.log = (content, type = "log") => {
	if (content == "error") {
		return;
	}
  const time = `[${moment(new Date()).format("h:mm:ss A")}] | `;
	switch (type) {
		case "log":
			log.info(content);
			console.log(`${time}${chalk.blue("[INFO]")} ${content}`);
			break;
		case "warn":
			log.warn(content);
			console.log(`${time}${chalk.yellow("[WARN]")} ${content}`);
			break;
		case "error":
			log.error(content);
			console.log(`${time}${chalk.red("[ERROR]")} ${content}`);
			break;
		case "debug":
      if (config?.debug) {
        log.debug(content);
        console.log(`${time}${chalk.grey("[DEBUG]")} ${content}`);
      }
			break;
		case "success":
			log.info(content);
			console.log(`${time}${chalk.green("[SUCCESS]")} ${content}`);
			break;
		default:
			break;
	}
};

exports.warn = (...args) => this.log(...args, "warn");

exports.error = (...args) => this.log(...args, "error");

exports.debug = (...args) => this.log(...args, "debug");

exports.success = (...args) => this.log(...args, "success");