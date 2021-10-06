const Discord = require("discord.js");
const mongoose = require("mongoose");
const logger = require("../utils/logger.js");

async function verify(config = {}) {
	logger.log("Verifying config..");

  if (process.version.slice(1).split(".")[0] < 16) {
    logger.error("NodeJS version must be \"16\" or higher.");
    return true;
  }

  if (config?.bot) {
    const check = ["prefix", "language", "ownerId", "guildId", "token", "mongodb"];
    let l = check.length;
    for (let x = 0; x < l; x++) {
      const key = check[x];
      if (key in config.bot) {
        if (!config.bot[key]) {
          logger.error(`"config.bot.${key}" - is empty, please provide the valid value.`);
          return true;
        }

        switch (key) {
          case "prefix": {
            if ((config.bot[key].match(new RegExp(/^([`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\w]+:?[a-zA-Z0-9]{1,6})$/gi)))) {
              logger.error(`"${config.bot[key]}" - Prefix is invalid, please used a unique one.`);
              return true;
            }
          }
          break;
          case "ownerId": {
            for (const id of config.bot[key]) {
              if (!(config.bot[key].match(new RegExp(/\d{16,22}$/gi)))) {
                logger.error(`"${id}" - OwnerId is invalid, please provide the correct user ID.`);
                return true;
              }
            }
          }
          break;
          case "guildId": {
            for (const id of config.bot[key]) {
              if (!(config.bot[key].match(new RegExp(/\d{16,22}$/gi)))) {
                logger.error(`"${id}" - GuildId is invalid, please provide the correct guild ID.`);
                return true;
              }
            }
          }
          break;
          case "token": {
            if (!(config.bot[key].match(new RegExp(/([A-z0-9]{24})\.([A-z0-9-]{6})\.([A-z0-9-]{27})/g)))) {
              logger.error(`Bot token is invalid, please provide the correct token.`);
              return true;
            } else {
              const client = new Discord.Client({ intents: ["GUILD_MEMBERS"] });
              await client.login(config.bot[key]).catch((err) => {
                if (err.message.includes("An invalid token was provided.")) {
                  logger.error("Bot token is invalid, please provide the correct token.");
                  return true;
                } else if (err.message.includes("Privileged intent provided is not enabled or whitelisted.")) {
                  logger.error("You need to enable privileged intents on the discord developer page.");
                  return true;
                }
              });
            }
          }
          break;
          case "mongodb": {
            if (!(config.bot[key].match(new RegExp(/^mongodb(?:\+srv|):\/\/(?:(?:(\w+)?:(\w+)?@)|:?@?)((?:[\w.-])+)(?::\d+)?(?:\/([\w-]+))?(?:\?([\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?)?$/gm)))) {
              logger.error(`MongoDB URL is invalid, please provide the correct mongodb URL.`);
              return true;
            } else {
              await mongoose.connect(config.bot[key], {
                useUnifiedTopology: true, useNewUrlParser: true 
              }).catch(() => {
                logger.error("Unable to connect to MongoDB, please provide the correct mongodb URL.");
                return true;
              });
            }
          }
        }
      } else {
        logger.error(`"config.bot.${key}" is missing, please execute "npm run config"`);
        return true;
      }
    }
  } else {
    logger.error(`"config.bot" is missing, please execute "npm run config"`);
    return true;
  }
}

module.exports = verify;