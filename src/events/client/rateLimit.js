const Event = require("../../structs/event.js");

/**
 * Ratelimit event
 * @extends {Event}
*/
class RateLimit extends Event {
  constructor(...args) {
    super(...args, {
      dirname: __dirname
    });
  }

  /**
   * Function for recieving event.
   * @param {object} Data
   * @param {string} Data.route
   * @param {number} Data.timeout
   */
  async run({ route, timeout }) {
    if (this.client.config.debug) {
      this.client.logger.debug(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);
    }
  }
}

module.exports = RateLimit;