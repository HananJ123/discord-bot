const { ShardingManager } = require("discord.js");
const verify = require("./scripts/verifyConfig.js");
const logger = require("./utils/logger.js");
const config = require("./config.js");

(async () => {

  if (!(await verify(config))) {
		const manager = new ShardingManager("./src/main.js", {
			// Sharding options
			totalShards: "auto",
			token: config.bot.token,
		});

    try {
			await manager.spawn();
		} catch (err) {
			logger.error(`Error loading shards: ${err.message}`);
		}

    manager.on("shardCreate", (shard) => {
      logger.log(`Shard ${shard.id} launched`);
		});
  } else {
		logger.error("Please fix your errors before loading the bot.");
		process.exit();
	}

})();