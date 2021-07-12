const Selector = require('./Selector');

module.exports = class PlaceHolderSelector extends Selector {
  // eslint-disable-next-line class-methods-use-this
  matches(value) {
    return typeof value === 'string'
            && value.includes('${')
            && value.includes('}')
            && value.indexOf('${') < value.indexOf('}');
  }
};
