const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const { Guild, User } = require("discord.js");
const Client = require("./core.js");

class Prefix {
  /**
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Check if content contains prefix.
   * @param {Object} option
   * @param {String} option.content
   * @param {Guild} option.guild
   * @param {User} option.user
   * @returns {Boolean}
   */
  async match({ content, guild }) {
    const prefix = await this.get(guild?.id);
    const regex = new RegExp(`^(${prefix ? `${escapeRegex(prefix)}|` : ""}<@!?${this.client.user.id}>|${escapeRegex(this.client.user.username.toLowerCase())})`, "i", "(s+)?");

    const matched = content.toLowerCase().match(regex);

    return (matched && matched.length && matched[0]);
  }

  async get(guildId) {
    const settings = await this.client.guild.get(guildId);
    return settings?.prefix;
  }
};

module.exports = Prefix;