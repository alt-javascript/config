const _ = require('lodash');
const Selector = require('./Selector');

module.exports = class PrefixSelector extends Selector {
  constructor(prefix) {
    super();
    this.prefix = prefix || 'enc.';
  }

  matches(value) {
    return typeof value === 'string' && value.startsWith(this.prefix);
  }

  resolveValue(value) {
    return _.replace(value, this.prefix, '');
  }
};
