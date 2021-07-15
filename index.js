const DelegatingConfig = require('./DelegatingConfig');
const DelegatingResolver = require('./DelegatingResolver');
const EphemeralConfig = require('./EphemeralConfig');
const JasyptDecryptor = require('./JasyptDecryptor');
const Resolver = require('./Resolver');
const PlaceHolderResolver = require('./PlaceHolderResolver');
const PlaceHolderSelector = require('./PlaceHolderSelector');
const PrefixSelector = require('./PrefixSelector');
const SelectiveResolver = require('./SelectiveResolver');
const Selector = require('./Selector');
const URLResolver = require('./URLResolver');
const ValueResolvingConfig = require('./ValueResolvingConfig');
const ConfigFactory = require('./ConfigFactory');

module.exports = {
  ConfigFactory,
  DelegatingConfig,
  DelegatingResolver,
  EphemeralConfig,
  JasyptDecryptor,
  PlaceHolderResolver,
  PlaceHolderSelector,
  PrefixSelector,
  Resolver,
  SelectiveResolver,
  Selector,
  URLResolver,
  ValueResolvingConfig,
  config: ConfigFactory.getConfig(),
};
