const ms = require("pretty-ms");

class Timer {
  constructor() {
    this.NS_PER_SEC = 1e9;
    this.MS_PER_NS = 1e-6
    this.start = process.hrtime();
  }
  
  toMs() {
    const diff = process.hrtime(this.start);
    return (diff[0] * this.NS_PER_SEC + diff[1]) * this.MS_PER_NS;
  }

  toString(options = {}) {
    return ms(this.toMs(), options);
  }
};

module.exports = Timer;