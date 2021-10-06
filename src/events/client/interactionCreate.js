const Event = require("../../structs/event.js");
const { Interaction } = require("discord.js");

/**
 * InteractionCreate event
 * @extends {Event}
*/
class InteractionCreate extends Event {
  constructor(...args) {
    super(...args, {
      dirname: __dirname
    });
  }

  /**
   * @param {Interaction} interaction
	 **/
  async run(interaction) {
    const command = this.client.commands.get(interaction.commandName) || this.client.eval.languages.find((x) => x.interaction.name.includes(interaction.commandName));
    if (!command) {
      return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }

    if (interaction.isCommand()) {
        interaction.args = this.transformInteraction([...interaction.options.data]);
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        
        await command.callback(interaction);
    } else if (interaction.isContextMenu()) {
      if (command.interaction.type === "MESSAGE") {
        interaction.message = await interaction.channel.messages.fetch(interaction.targetId);
        interaction.member = interaction.guild.members.cache.get(interaction.message.author.id);
        interaction.user = await this.client.users.fetch(interaction.message.author.id);
      } else if (command.interaction.type === "USER") {
        interaction.member = interaction.guild.members.cache.get(interaction.targetId);
        interaction.user = await this.client.users.fetch(interaction.targetId);
      } else {
        //Do nothing
      }

      await command.callback(interaction);
    } else {
      //Do nothing
    }

    return;
  }

  transformInteraction(options) {
    const opts = {};
    for (const top of options) {
      if (top.type === "SUB_COMMAND" || top.type === "SUB_COMMAND_GROUP") {
        opts[top.name] = this.transformInteraction(top.options ? [...top.options] : []);
      } else if (top.type === "USER") {
        opts[top.name] = { user: top.user, member: top.member };
      } else if (top.type === "CHANNEL") {
        opts[top.name] = top.channel;
      } else if (top.type === "ROLE") {
        opts[top.name] = top.role;
      } else {
        opts[top.name] = top.value;
      }
    }

    return opts;
  }
}

module.exports = InteractionCreate;