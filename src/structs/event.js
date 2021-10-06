const Client = require("./core.js");
const { Boolify } = require("../utils/boolify.js");
const path = require("path");

/**
 * @typedef EventOption
 * @property {Boolean} dirname
 * @property {String} name
 * @property {Boolean} once
 */
/**
 * @typedef Data
 * @property {Client} client
 * @property {String} name
 */
/**
 * Event structure
 * @abstract
 */
class Event {

  /**
   * @param {Data} data
   * @param {EventOption} event
   */
  constructor(data = {}, event = {}) {
    const category = (event.dirname ? event.dirname.split(path.sep)[parseInt(event.dirname.split(path.sep).length - 1, 10)] : "Other");
    this.client = data.client;

    this.category = category !== "events" ? category : null;
    this.name = event?.name ?? data.name;
    this.type = Boolify(event?.once, { isNull: "on", isTrue:"once", isFalse: "on" });
    this.emitter = (typeof event.emitter === "string" ? this.client[event.emitter] : event.emitter) || this.client;
  }

  /**
   * Function for recieving message.
   * @param {*} args
   */
  // eslint-disable-next-line no-unused-vars
  async run(...args) {
    throw new Error(`Event: ${this.name} does not have a run method`);
  }
}

module.exports = Event;