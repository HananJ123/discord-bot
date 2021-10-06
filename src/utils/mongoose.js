const Client = require("../structs/core.js");
const mongoose = require("mongoose");

exports.ping = async () => {
  const currentNano = process.hrtime();
  await mongoose.connection.db.command({ ping: 1 });
  const time = process.hrtime(currentNano);
  return (time[0] * 1e9 + time[1]) * 1e-6;
};

/**
 * @param {Client} client
 */
exports.init = (client) => {
  if (mongoose.connection.readyState !== 1) {
    if (!client.config.bot?.mongodb) {
      client.logger.error("A mongoose connection is required because there is no established connection with mongoose!");
      return false;
    }
    
    mongoose.connect(client.config.bot.mongodb, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      connectTimeoutMS: 10000,
      autoIndex: false,
      family: 4
    });
  }
  mongoose.Promise = global.Promise;
  mongoose.connection.on("connected", () => {
    client.logger.success("MongoDB successfully connected");
  });
  mongoose.connection.on("err", (err) => {
    client.logger.error("MongoDB has encountered an error: " + err.stack);
  });
  mongoose.connection.on("disconnected", () => {
    client.logger.error("MongoDB disconnected");
  });
};