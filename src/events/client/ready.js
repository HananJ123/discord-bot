const Event = require("../../structs/event.js");

/**
 * Ready event
 * @extends {Event}
*/
class Ready extends Event {
  constructor(...args) {
    super(...args, {
      dirname: __dirname,
      once: true
    });
  }

  async run() {
    this.client.user.setPresence({ activities: [{ name: 'with discord.js' }], status: 'idle' });
    const guilds = [...this.client.guilds.cache.values()];

    for (const guild of guilds) {
      console.log(guild.id)
    }
  }
}

module.exports = Ready;