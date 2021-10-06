const Client = require("./core.js");
const { CommandInteraction, Message } = require("discord.js");
const { Boolify } = require("../utils/boolify.js");
const path = require("path");

/**
 * @typedef Interaction
 * @property {String} name
 * @property {String} description
 * @property {String} type
 * @property {Object[]} options
 */
/**
 * @typedef Disabled
 * @property {Boolean} command
 * @property {Boolean} interaction
 */
/**
 * @typedef CommandOption
 * @property {String} dirname
 * @property {String} name
 * @property {String} description
 * @property {String} usage
 * @property {String[]} aliases
 * @property {String[]} examples
 * @property {Number} cooldown
 * @property {Boolean} nsfw
 * @property {Boolean} guildOnly
 * @property {Boolean} ownerOnly
 * @property {String[]} botPermissions
 * @property {String[]} userPermissions
 * @property {Disabled} disabled
 * @property {Interaction} interaction
 */
/**
 * @typedef Data
 * @property {Client} client
 * @property {String} name
 */
/**
 * Command structure
 * @abstract
 */
class Command {

  /**
   * @param {Data} data
   * @param {CommandOption} command
   */
  constructor(data = {}, command = {}) {
    const category = (command.dirname ? command.dirname.split(path.sep)[parseInt(command.dirname.split(path.sep).length - 1, 10)] : "Other");
    this.client = data.client;
    
    this.category = category !== "commands" ? category : null;
    this.name = command?.name ?? data.name;
    this.description = command?.description ?? "There is no description for this command.";
    this.usage = command.usage ?? "";
    this.aliases = command.aliases ?? new Array();
    this.examples = command.examples ?? new Array();
    this.config = {
      permissions: {
        bot: command.botPermissions ?? new Array(),
        user: command.userPermissions ?? new Array(),
      },
      onlyFor: {
        guild: Boolify(command.guildOnly, { isNull: true }),
        owner: Boolify(command.ownerOnly, { isNull: false }),
      },
      disabled: {
        command: Boolify(command.disabled?.command, { isNull: true }),
        interaction: Boolify(command.disabled?.interaction, { isNull: true }),
      },
      cooldown: command.cooldown ?? 3000,
      nsfw: Boolify(command.nsfw, { isNull: false }),
    };
    this.interaction = {
      name: command.interaction?.name ?? this.name,
      description: command.interaction?.description ?? this.description,
      options: command.interaction?.options ?? new Array(),
      type: command.interaction?.type?.toUpperCase() ?? "CHAT_INPUT",
      defaultPermission: Boolify(command.userPermissions, {
        isNull: true, isTrue: false, isFalse: true
      })
    };
  }

  /**
   * @param {Message} message
   */
  async run() {
    throw new Error(`Command: ${this.name} does not have a run method`);
  }

  /**
   * @param {CommandInteraction} interaction
   */
  async callback() {
    throw new Error(`Command: ${this.name} does not have a callback method`);
  }


  
}

module.exports = Command;