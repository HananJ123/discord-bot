require("dotenv").config();

const Interaction = require("./interaction.js");
const Evaluation = require("./evaluation.js");
const Handler = require("./handler.js");
const Command = require("./command.js");
const Discord = require("discord.js");
const Prefix = require("./prefix.js");
const Check = require("./check.js");
const Guild = require("./guild.js");

const mongoose = require("../utils/mongoose.js");
const logger = require("../utils/logger.js");
const config = require("../config.js");
const timer = require("./timer.js");

class Core extends Discord.Client {

  /**
   * @param {Discord.ClientOptions} props
   */
  constructor(props = {}) {
    // Pass in any client configuration you want for the bot.
    // more client options can be found at
    // https://discord.js.org/#/docs/main/13.1.0/typedef/ClientOptions
    props.intents = 32767;
    props.partials = ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"];
    props.allowedMentions = { parse: ["users"] };
    props.restTimeOffset = 0;
    props.shards = "auto";
    props.restWsBridgeTimeout = 100;
    super(props);

    
    this.timer = timer;
    this.config = config;
    this.logger = logger;
    this.mongoose = mongoose;
    this.messages = { sent: 0, received: 0 };

    /** @type {Discord.Collection<String,String>} */
    this.ratelimits = new Discord.Collection();
    /** @type {Discord.Collection<String,Command>} */
    this.commands = new Discord.Collection();
    
    this.interaction = new Interaction(this);
    this.handler = new Handler(this);
    this.prefix = new Prefix(this);
    this.guild = new Guild(this);
    this.check = new Check(this);
    this.eval = new Evaluation(this);
  }

  delay(ms = 3000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async connect(token = this.config.bot?.token){
    return super.login(token);
  }

  owners(guild) {
    if (guild.prototype instanceof Discord.Guild) {
      this.client.logger.error("Incorrect structure: Make sure your using a correct class structure.");
      return [this.config.bot.ownerId].filter((m) => m.length >= 1);
    }

    const role = guild.roles.cache.find((r) => r.name.toLowerCase() === "contributors") || (async () => await guild.roles.create({ name: "Contributors", color: "#8875dd" }))();
    /**
     * const contributors = [...guild.members.cache.values()]
      .filter((m) => m.roles.cache.find((x) => x.name === role.name)
        .map((member) => (member.user.id)));
        */

    return [this.config.bot.ownerId].filter((m) => m.length >= 1);
  }

  get version() {
    return {
      library: Discord.version,
      [require(`${process.cwd()}/package.json`).name]: require(`${process.cwd()}/package.json`).version,
    };
  }
};

module.exports = Core;
