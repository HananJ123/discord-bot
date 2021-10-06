const Command = require("../../structs/command");
const { CommandInteraction, Message } = require("discord.js");

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      dirname: __dirname,
      disabled: {
        interaction: false
      }
    });
    this.uptime = (Date.now() / 1000 - this.client.uptime / 1000).toFixed(0);
  }


  /**
   * Function for recieving message.
   * @param {Message} message
   */
  async run(message) {

    return message.channel.send({ content: `Bot up since: <t:${this.uptime}:R>` });
  }

  /**
   * Function for recieving interaction.
   * @param {CommandInteraction} interaction
   */
  async callback(interaction) {
    return interaction.reply({ content: `Bot up since: <t:${this.uptime}:R>` });
  }
};

module.exports = Ping;