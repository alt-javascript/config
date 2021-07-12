const npmconfig = require('config');
const ValueResolvingConfig = require('./ValueResolvingConfig');
const DelegatingResolver = require('./DelegatingResolver');
const PlaceHolderResolver = require('./PlaceHolderResolver');
const PlaceHolderSelector = require('./PlaceHolderSelector');
const JasyptDecryptor = require('./JasyptDecryptor');
const PrefixSelector = require('./PrefixSelector');

module.exports = class ConfigFactory {
  static getConfig(config, resolver) {
    const placeHolderResolver = new PlaceHolderResolver(new PlaceHolderSelector());
    const jasyptDecryptor = new JasyptDecryptor(new PrefixSelector());
    const delegatingResolver = new DelegatingResolver([placeHolderResolver, jasyptDecryptor]);
    const valueResolvingConfig = new ValueResolvingConfig(config || npmconfig,
      resolver || delegatingResolver);

    placeHolderResolver.reference = valueResolvingConfig;
    return valueResolvingConfig;
  }
};
