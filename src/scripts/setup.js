require("dotenv").config();
const prompts = require("prompts");
const chalk = require("chalk");
const fs = require("fs");

console.log("-".repeat(35));
console.log(" ".repeat(8) + "Bot Configuration");
console.log("-".repeat(35));

const questions = [
  {
    type: "password",
    name: "DISCORD_TOKEN",
    message: "What is the token of your Discord bot?",
    initial: process.env.DISCORD_TOKEN || "",
    validate: (text) => text.match(new RegExp(/([A-z0-9]{24})\.([A-z0-9-]{6})\.([A-z0-9-]{27})/g)),
  },
  {
    type: "password",
    name: "MONGO_URL",
    message: "What is your MongoDB URL?",
    initial: process.env.MONGO_URL || "",
    validate: (text) => text.match(new RegExp(/^mongodb(?:\+srv|):\/\/((.+):(.+)@)?([^:@]+):([^:]+)\/(.+?)$/gm)),
  },
  {
    type: "text",
    name: "ID_OWNER",
    message: "Could you please provide the owner's ID for this bot?",
    initial: process.env.ID_OWNER || "817238971255488533",
    validate: (text) => text.length >= 15,
  },
  {
    type: "text",
    name: "ID_GUILD",
    message: "What is the ID of your guild? Would you mind providing it?",
    initial: process.env.ID_GUILD || "817240181987737613",
    validate: (text) => text.length >= 15,
  },
  {
    type: "text",
    name: "PREFIX",
    message: "What will be your bot prefix?",
    initial: process.env.PREFIX || "m;",
    validate: (text) => text.length >= 1,
  },
  {
    type: "text",
    name: "TIMEZONE",
    message: "What is your timezone?",
    initial: process.env.TIMEZONE || "Asia/Manila",
    validate: (text) => Boolean(require("timezone-validator")(text)),
  },
  {
    type: "select",
    name: "LANGUAGE",
    message: "What will be your Bot Language?",
    choices: [
      { title: "English", value: "en" }
    ],
    initial: 0,
  },
  {
    type: "toggle",
    name: "ENABLE_CUSTOM_COLOR",
    message: "Use Custom Embed colors?",
    initial: false,
    active: "Yes",
    inactive: "No",
  },
  {
    type: (prev) => (prev === true ? "text" : null),
    name: "COLOR_EMBED",
    message: "Basic embed color? (#Hex)",
    initial: process.env.COLOR_NONE || "#ffa500",
  },
  {
    type: (prev) => (prev.length >= 1 ? "text" : null),
    name: "COLOR_LOADING",
    message: "Loading embed color? (#Hex)",
    initial: process.env.COLOR_LOADING || "#0080ff",
  },
  {
    type: (prev) => (prev.length >= 1 ? "text" : null),
    name: "COLOR_SUCCESS",
    message: "Success embed color? (#Hex)",
    initial: process.env.COLOR_SUCCESS || "#1e90ff",
  },
  {
    type: (prev) => (prev.length >= 1 ? "text" : null),
    name: "COLOR_WARN",
    message: "Warning embed color? (#Hex)",
    initial: process.env.COLOR_WARN || "#1e90ff",
  },
  {
    type: (prev) => (prev.length >= 1 ? "text" : null),
    name: "COLOR_ERROR",
    message: "Error embed color? (#Hex)",
    initial: process.env.COLOR_ERROR || "#8b0000",
  },
  {
    type: "toggle",
    name: "DEBUG",
    message: "Enable Debugging?",
    initial: false,
    active: "Yes",
    inactive: "No",
  }
];

const onCancel = () => {
  console.log(`${chalk.redBright(`Configuration was cancelled, to start again, use "npm run config"`)}`);
  process.exit(0);
};

(async () => {
  // Get the response from the prompts
  const response = await prompts(questions, { onCancel });
  console.log("-".repeat(35));
  console.log(" ".repeat(8) + "Bot Configured");
  console.log("-".repeat(35));
  console.log("To reconfigure, simply do \"npm run config\"");

  let env = "";
  env += `TZ=${response.TIMEZONE}\n`;
  env += `DISCORD_TOKEN=${response.DISCORD_TOKEN}\n`;
  env += `MONGO_URL=${response.MONGO_URL}`;

  let config = "";
  config += "const config = {\n";
  config += "  color: {\n";
  config += `    error: "${response.COLOR_ERROR || "#D6606C"}",\n`;
  config += `    loading: "${response.COLOR_LOADING || "#60A3D6"}",\n`;
  config += `    none: "${response.COLOR_NONE || "#60A3D6"}",\n`;
  config += `    success: "${response.COLOR_SUCCESS || "#5BCF76"}",\n`;
  config += `    warn: "${response.COLOR_WARN || "#DEC052"}",\n`;
  config += "  },\n";
  config += "  bot: {\n";
  config += `    prefix: "${response.PREFIX || "m;"}",\n`;
  config += `    language: "${response.LANGUAGE || "default"}",\n`;
  config += `    ownerId: "${response.ID_OWNER || ""}",\n`;
  config += `    guildId: "${response.ID_GUILD || ""}",\n`;
  config += `    token: process.env.DISCORD_TOKEN,\n`;
  config += `    mongodb: process.env.MONGO_URL\n`;
  config += "  },\n"
  config += `  debug: ${response.DEBUG ? "true" : "false"}\n`;
  config += "};\n\n";

  config += "module.exports = config;";

  await fs.writeFileSync(`${process.cwd()}/src/config.js`, config);
  await fs.writeFileSync(`${process.cwd()}/.env`, env);
})();
