const { Message } = require("discord.js");
const Command = require("./command.js");
const Client = require("./core.js");

class Check {
  
  /**
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * @param {Message} message
   * @param {Command} command
   */
  async command(message, command) {
    if (message.prototype instanceof Message) {
      this.client.log.error("Incorrect structure: Make sure your using a correct class structure.");
      return true;
    }

    let settings = await this.client.guild.get(message.guild?.id);

    if (!(message.guild) && !message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) {
      const content = "I don't have permission to send messages in that channel.";
      message.author.send({ content });

      return false;
    }

    if (!(message.guild) && !message.guild.me.permission.has("EMBED_LINKS")) {
      const content = "I require **Embed Links** permission in order to function correctly.";
      message.channel.send({ content });

      return false;
    }

    if (!(message.guild) && !message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS")) {
      const content = "I require **Embed Links** permission in order to function correctly.";
      message.channel.send({ content });

      return false;
    }

    if (!(message.guild) && command.config.onlyFor.guild) {
      const content = "This command cannot be executed on DM message.channel.";
      message.author.send({ content });

			return false;
		}

    if (!(message.guild) && command.config.nsfw && !message.channel.nsfw) {
      const content = "This command can only be run in a nsfw message.channel.";
      message.channel.send({ content });

      return false;
    }

    if (!(message.guild) && settings.category?.includes(category.category) && category.category !== "developer") {
      const content = "This command is unavailable on this guild.";
      message.channel.send({ content });

      return false;
    }

    if (command.config.onlyFor.owner && !(this.client.owners(message.guild).includes(message.author.id))) {
      const content = "This command can only be used by the developer of the bot.";
      message.channel.send({ content });

      return false;
    }

    
    if (message.guild) {
      let neededPermissions = [];
      command.config.permissions.bot.forEach((permission) => {
        if (["SPEAK", "CONNECT"].includes(permission)) {
          if (!message.member.voice.channel) return;
          if (!message.guild.me.permissionsIn(message.member.voice.channel).has(permission)) {
            neededPermissions.push(permission);
          }
        } else if (!message.guild.me.permissionsIn(message.channel).has(permission)) {
          neededPermissions.push(permission);
        }
      });

      if (neededPermissions.length > 0) {
        const content = `Missing Bot permission: "${neededPermissions.join(", ")}" in [${message.guild.id}].`;
        message.channel.send({ content });

        return false;
      }

      command.config.permissions.user.forEach((permission) => {
        if (!message.member.permissionsIn(message.channel).has(permission)) {
          neededPermissions.push(permission);
        }
      });

      if (neededPermissions.length > 0) {
        const content = `Missing User permission: "${neededPermissions.join(", ")}" in [${message.guild.id}].`;
        message.channel.send({ content });

        return false;
      }
    }

    return true;
  }
};

module.exports = Check;