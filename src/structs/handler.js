const Client = require("./core.js");
const Command = require("./command.js");
const Event = require("./event.js");

const { resolve, parse } = require("path");
const { sync } = require("glob");

class Handler {

  /**
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
    this.count = {
      commands: 0,
      interactions: 0,
      events: 0
    }
  }

  get load() {
    return {
      commands: () => {
        const Files = sync(resolve(`./src/commands/**/*.js`));
        if (!Files.length) {
          this.client.logger.warn("No command found: Make sure you have atleast 1 event in the event directory.");
          return;
        }

        Files.forEach((filepath) => {
          delete require.cache[require.resolve(filepath)];
          const File = require(filepath);
          const { name } = parse(filepath);
          if (!(File.prototype instanceof Command)) {
            this.client.logger.error(`Command ${name} doesn't belongs in Commands directory.`);
          }

          /**
           * @type {Command}
           */
          const command = new File({ client: this.client, name });
          this.client.commands.set(command.name, command);
          this.client.logger.success(`Loaded ${command.config.disabled?.interaction
            ? "Command" : "Command with Interaction"}: ${command.name}`);

          this.count.commands++
          if (!(command.config.disabled?.interaction)) {
            this.count.interactions++
          }
        });
      },
      events: () => {
        const Files = sync(resolve(`./src/events/**/*.js`));
        if (!Files.length) {
          this.client.logger.error(`Event ${name} doesn't belongs in Events directory.`);
          return;
        }

        Files.forEach((filepath) => {
          delete require.cache[require.resolve(filepath)];
          const File = require(filepath);
          const { name } = parse(filepath);
          if (!(File.prototype instanceof Event)) {
            this.client.logger.warn("Incorrect structure: Make sure your using a correct class structure.");
            return;
          }

          /**
           * @type {Event}
           */
          const event = new File({ client: this.client, name });
          event.emitter[event.type](event.name, (...args) => event.run(...args));

          this.client.logger.success(`Loaded Event: ${event.name}`);

          this.count.events++
        });
      }
    }
  }
}

module.exports = Handler;