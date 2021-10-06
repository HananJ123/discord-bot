const Command = require("../structs/command");
const { CommandInteraction, Formatters, Message } = require("discord.js");

class Deploy extends Command {
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

    const loaded = await this.client.interaction.load(message.guild);

    if (loaded) {
      return message.channel.send({ content: "ok!" });
    } else {
      return message.channel.send({ content: "not ok!" });
    }
  }

};

module.exports = Deploy;