const Core = require("./structs/core.js");
const client = new Core();

client.connect().then(() => {
  client.on("ready", async() => {
    client.mongoose.init(client);
    await client.delay();
    client.handler.load.commands();
    await client.delay();
    client.handler.load.events();
    await client.delay();
    client.logger.success(`Total Commands: ${client.handler.count.commands}`);
    client.logger.success(`Total Interactions: ${client.handler.count.interactions}`);
    client.logger.success(`Total Events: ${client.handler.count.events}`);
  });
}).catch((err) => client.logger.error("An unexpected error occured: " + err));

process.on("unhandledRejection", (err) => {
	client.logger.error(`Unhandled Rejection: ${err.message}`);
	console.log(err);
});

process.on("uncaughtException", (err) => {
	client.logger.error(`Uncaught exception: ${err.message}`);
	console.log(err);

});

process.on("uncaughtExceptionMonitor", (err) => {
	client.logger.error(`Uncaught exception monitor: ${err.message}`);
	console.log(err);
});