const BASE_URL = "https://emkc.org/api/v1/piston";
const { Collection } = require("discord.js");
const got = require("got");

class Evaluation {
  /**
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
    this.languages = new Collection();
    this.fetchLanguages();
  }

  async fetchLanguages() {
    try {
      const data = await got(`${BASE_URL}/versions`).json();
      for (const lang of data) {
        this.languages.set(lang.name, lang);
      }
    } catch (err) {
      return null;
    }
  }


  async code(language = "js", source = null, args = []) {
    if (typeof source !== "string") return;

    const payload = { language, source, args: args && Array.isArray(args) ? args : [] };

    try {
      const data = await got.post(`${BASE_URL}/execute`, {
        body: JSON.stringify(payload)
      }).json();

      return data;
    } catch (err) {
      if (typeof err !== "string") {
        throw "External server error, please try again later.";
      } else {
        throw err;
      }
    }
  }
}

module.exports = Evaluation;