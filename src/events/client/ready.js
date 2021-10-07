const Event = require("../../structs/event.js");

/**
 * Ready event
 * @extends {Event}
*/
class Ready extends Event {
  constructor(...args) {
    super(...args, {
      dirname: __dirname
    });
  }

  async run() {
    console.log("Ready emitted.");
  }
}

module.exports = Ready;