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
	 * @param {Error} err
   */
  async run(err) {
		this.client.logger.error(`Bot encountered an error: ${err.message}.`);
		console.log(err);
  }
}

module.exports = Error;