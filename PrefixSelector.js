/* eslint-disable import/extensions */
import Selector from './Selector.js';

export default class PrefixSelector extends Selector {
  constructor(prefix) {
    super();
    this.prefix = prefix;
  }

  matches(value) {
    return typeof value === 'string' && value.startsWith(this.prefix);
  }

  resolveValue(value) {
    return value.replaceAll(this.prefix, '');
  }

  async asyncResolveValue(value) {
    return this.resolveValue(value);
  }
}
