const config = {
  color: {
    error: "",
    loading: "",
    none: "",
    success: "",
    warn: ""
  },
  bot: {
    prefix: "",
    language: "",
    guildId: "",
    ownerId: "",
    token: process.env.DISCORD_TOKEN,
    mongodb: process.env.MONGO_URL
  },
  debug: false
};

module.exports = config;