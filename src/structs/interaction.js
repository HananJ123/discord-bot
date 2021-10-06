class Interaction {
  /**
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
  }

  async load(guild) {
    const settings = await this.client.guild.get(guild.id);
    const interactions = [...this.client.commands.values()]
    .filter((command) => !command.config.disabled?.interaction || settings.disabled.interaction.includes(command.name))
    .map((command) => {
      let interaction = {};
      interaction.name = command.interaction.name;
      interaction.description = command.interaction.description;
      interaction.defaultPermission = command.interaction.defaultPermission;
      interaction.options = command.interaction.options;

      if (["MESSAGE", "USER"].includes(command.interaction.type)) {
        delete interaction.description;
        delete interaction.options
      }

      return interaction;
    });
    try {
      await guild.commands.set(interactions).then((command) => {
        const getRoles = (commandName) => {
          const permissions = this.client.commands.find((x) => x.name === commandName).userPermissions;
          if (!permissions) return null;
          return guild.roles.cache.filter((x) => x.permissions.has(permissions) && !x.managed);
        };

        const fullPermissions = command.reduce((acc, x) => {
          const roles = getRoles(x.name);
          if (!roles) return acc;

          const permissions = roles.reduce((a, v) => {
            return [...a, {
              id: v.id,
              type: "ROLE",
              permission: true
            }];
          }, []);

          return [...acc, {
            id: x.id,
            permissions
          }];
        }, []);
        return guild.commands.permissions.set({ fullPermissions });
      });

      this.client.logger.log(`Loaded Interactions for guild: ${guild.name}`);
      return true;
    } catch(err) {
      this.client.logger.error(`Failed to load interactions for guild: ${guild.id} due to: ${err.message}.`);
      return false;
    }
  }
}

module.exports = Interaction;