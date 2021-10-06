const Command = require("../structs/command");
const { CommandInteraction, Formatters, Message } = require("discord.js");
const { pick } = require("lodash");

const got = require("got");
const rand = require("rand-gen");

class Evaluation extends Command {
  constructor(...args) {
    super(...args, {
      dirname: __dirname,
      ownerOnly: true
    });
  }

  /**
   * Function for recieving message.
   * @param {Message} message
   */
  async run(message) {
    const content = this.input(message.args);

    try {
      const start = new this.client.timer();
      const evaled = await this.execute(message, content);
      const ms = start.toString({ verbose: true });
      const output = await this.clean(evaled);

      const MAX_CHARS = 3 + 2 + output.length + 3;
      if (MAX_CHARS >= 2000) {
        return message.channel.send({
          content: [
            `*It took ${ms} to evaluate the code.*`,
            "Output exceeded 2000 characters. Sending as a file."
          ].join("\n"),
          files: [{ attachment: Buffer.from(output), name: `output.${content?.lang ?? "text"}` }],
        });
      }

      return message.channel.send({ 
        content: [
          `*It took ${ms} to evaluate the code.*`,
          `\`\`\`${content?.lang}\n${output}\n\`\`\``
        ].join("\n")
      });
    } catch (err) {
      this.client.logger.error(`An unexpected error occured while evaluating the code: ${err.toString()}`);
      return message.channel.send({ content: [
          `*An unexpected error occured while evaluating the code.*`,
          `\`\` ${err.toString()} \`\``
        ].join("\n")
      });
    }
  }

  async execute(message, { lang, code }) {
    const language = this.client.eval.languages.get(lang) || this.client.eval.languages.find((l) => l?.aliases.includes(lang));

    if (language?.name === "javascript" && this.client.config.bot?.ownerId.includes(message.author.id)) {
      return eval(code);
    } else if (language) {
      return this.client.eval.code(language.name, code)
      .then((data) => (data.output.length > 0 ? data.output : "void"));
    } else {
      throw "Unsupported programming language.";
    }
  }

  async clean(text) {
    if (text && text.constructor.name == "Promise") {
      text = await text;
    }
    if (typeof text !== "string") {
      text = require("util").inspect(text, { depth: 1 });
    }

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replaceAll(this.client.config.bot.token, this.client.config.bot.token.split(".")
      .map((val, i) => (rand({ length: val.length, spChars: false }).gen())).join("."));

    text = text.replaceAll(new RegExp(/mongodb(?:\+srv|):\/\/((.+):(.+)@)?([^:@]+):([^:]+)\/(.+?)$/gm), () => {
      const mongodb = this.client.config.bot.mongodb;
      const [,name,pass,_,dbname] = new RegExp(/^mongodb(?:\+srv|):\/\/(?:(?:(\w+)?:(\w+)?@)|:?@?)((?:[\w.-])+)(?::\d+)?(?:\/([\w-]+))?(?:\?([\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?)?$/gm).exec(mongodb);
      
      return mongodb
      .replace(name, (rand({ length: name.length, spChars: false }).gen()))
      .replace(pass, (rand({ length: pass.length + Math.random() * 5, spChars: false }).gen()))
      .replace(dbname, (rand({ length: dbname.length, spChars: false }).gen()))
    });

    
    return text;
  }

  input(content) {
    let lang = "javascript";
    let result;
    if (Array.isArray(content)) {
      content = content.join(" ");
    }

    const input = new RegExp(/^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm).exec(content);
    const input1 = new RegExp(/^(([ \t]*`{3,4})([\s\S]+?)(^[ \t]*\2))/gm).exec(content);

    if (input) {
      content = input[4];
      lang = input[3] ?? lang;
    } else if (input1) {
      content = input[3];
    }

    return ({ lang, code: content });
  }
};

module.exports = Evaluation;