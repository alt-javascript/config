const Resolver = require('./Resolver');

module.exports = class SelectiveResolver extends Resolver {
  constructor(selector) {
    super();
    this.selector = selector;
  }
};
