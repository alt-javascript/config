/* eslint-disable import/extensions */
import Resolver from './Resolver.js';
import SelectiveResolver from './SelectiveResolver.js';
import PlaceHolderSelector from './PlaceHolderSelector.js';

export default class PlaceHolderResolver extends SelectiveResolver {
  constructor(selector, reference) {
    super(selector || (new PlaceHolderSelector()));
    this.reference = reference;
  }

  resolve(config) {
    const self = this;
    const resolvedConfig = Resolver.prototype.mapValuesDeep(config, (v) => {
      if (self.selector.matches(v)) {
        try {
          let resolvedValue = '';
          let remainder = v;
          let placeholder;

          while (resolvedValue === '' || (remainder.includes('${')
                                && remainder.includes('}')
                                && remainder.indexOf('${') < remainder.indexOf('}'))
          ) {
            resolvedValue = `${resolvedValue}${remainder.substring(0, remainder.indexOf('${'))}`;
            placeholder = remainder.substring(remainder.indexOf('${') + 2, remainder.indexOf('}'));
            resolvedValue = `${resolvedValue}${self.reference.get(placeholder)}`;
            remainder = remainder.substring(remainder.indexOf('}') + 1);
          }
          resolvedValue = `${resolvedValue}${remainder}`;
          return resolvedValue;
        } catch (e) {
          return v;
        }
      }
      return v;
    });
    return resolvedConfig;
  }
}
