const Event = require("../../structs/event.js");

/**
 * Message create event
 * @extends {Event}
*/
class MessageCreate extends Event {
  constructor(...args) {
    super(...args, {
      dirname: __dirname
    });
  }

  /**
   * Function for recieving message.
   * @param {Message} message
   */
  async run(message) {
    // Should not respond to bots
    if (message.author.bot) return;
    const settings = await this.client.guild.get(message.guild?.id);
    const prefix = await this.client.prefix.match(message);

    if (prefix) {
      message.args = message.content.slice(prefix.length).trim().split(/ +/g);
      message.commandName = message.args.shift().toLowerCase();
    } else if (message.mentions.users.first()?.id === message.client.user.id) {
      message.args = message.content.trim().split(/ +/g);
      message.commandName = message.args.shift().toLowerCase();
    }

    const command = this.client.commands.get(message?.commandName) || this.client.commands.find((cmd) => cmd?.aliases.includes(message?.commandName));

    if (command) {
      if (!(await this.client.check.command(message, command))) {
        if (message.deletable) {
          setTimeout(() => message.delete(), 3000);
        }
        return;
      }
      try {
        await command.run(message);
      } catch (err) {
        this.client.logger.error(`Command: ${command.name} - ${err.message}`);
        console.log(err);
        return false;
      } finally {
        if (this.client.config.debug) {
          this.client.logger.debug(`Command: ${command.name} was ran by ${message.author.tag}${!message.guild ? " in DM's" : ` in guild: ${message.guild.id}`}.`);
        }
      }
    }

  }
}

module.exports = MessageCreate;