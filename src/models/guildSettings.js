const { Schema, model } = require("mongoose");
const config = require("../config.js");

const guildSchema = Schema({
  guildId: { type: String, default: config?.guildId ?? "" },
  prefix: { type: String, default: config?.prefix ?? "m;" },
  language: { type: String, default: config?.language ?? "en" },
  disabled: {
    command: { type: Array, default: [] },
    interaction: { type: Array, default: [] },
  }
}, {
  versionKey: false
});

module.exports = model("Guild", guildSchema);