const GuildSettings = require("../models/guildSettings.js");
const Client = require("./core.js");

class Guild {
  /**
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * @param {string} guildId
   */
  async delete(guildId) {
    try {
      await GuildSettings.findOneAndRemove({ guildID });
      return true;
    } catch (err) {
      this.client.logger.error(err.message);
      return false;
    }
  }

  /**
   * @param {string} guildId
   */
  async add(guildId) {
    try {
      let data = await GuildSettings.findOne({ guildId });
      if (!data) {
        data = new GuildSettings({ guildId });
        data.save();
      }
      return true;
    } catch (err) {
      this.client.logger.error(err.message);
      return false;
    }
  }

  /**
   * @param {string} guildId
   */
  async get(guildId) {
    if (typeof guildId !== "string") {
      return null;
    }
    
    try {
      let data = await GuildSettings.findOne({ guildId });
      if (data) {
        return data;
      } else {
        const added = await this.add(guildId);
        if (added) {
          data = await GuildSettings.findOne({ guildId });
        } else {
          data = null;
        }
        return data;
      }
    } catch (err) {
      this.client.logger.error(err.message);
      return false;
    }
  }

  /**
   * @param {string} guildId
   */
  async has(guildId) {
    return Boolean((await this.get(guildId)));
  }
}

module.exports = Guild;