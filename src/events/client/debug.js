const Event = require("../../structs/event.js");

/**
 * Ready event
 * @extends {Event}
*/
class Error extends Event {
  constructor(...args) {
    super(...args, {
      dirname: __dirname,
      once: true
    });
  }

	/**
	 * Function for recieving event.
	 * @param {string} info
   */
  async run(info) {
		this.client.logger.debug(info);
  }
}

module.exports = Error;