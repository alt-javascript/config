/* eslint-disable import/extensions */
import Selector from './Selector.js';

export default class PlaceHolderSelector extends Selector {
  // eslint-disable-next-line class-methods-use-this
  matches(value) {
    return typeof value === 'string'
            && value.includes('${')
            && value.includes('}')
            && value.indexOf('${') < value.indexOf('}');
  }
};
