const npmconfig = require('config');
const ValueResolvingConfig = require('./ValueResolvingConfig');
const DelegatingResolver = require('./DelegatingResolver');
const PlaceHolderResolver = require('./PlaceHolderResolver');
const PlaceHolderSelector = require('./PlaceHolderSelector');
const JasyptDecryptor = require('./JasyptDecryptor');
const PrefixSelector = require('./PrefixSelector');
const URLResolver = require('./URLResolver');

module.exports = class ConfigFactory {
  static detectBrowser() {
    const browser = !(typeof window === 'undefined');
    return browser;
  }

  static detectFetch(fetchArg) {
    let $fetch = null;
    if (!(typeof fetch === 'undefined')) {
      // eslint-disable-next-line no-undef
      $fetch = fetch;
    }
    if (global?.boot?.contexts?.root?.fetch) {
      $fetch = global.boot.contexts.root.fetch;
    }
    if (ConfigFactory.detectBrowser() && window?.fetch) {
      $fetch = window.fetch;
    }
    if (ConfigFactory.detectBrowser() && window?.boot?.contexts?.root?.fetch) {
      $fetch = window.boot.contexts.root.fetch;
    }
    $fetch = fetchArg || $fetch;
    return $fetch;
  }

  static getConfig(config, resolver, fetchArg) {
    const placeHolderResolver = new PlaceHolderResolver(new PlaceHolderSelector());
    const jasyptDecryptor = new JasyptDecryptor(new PrefixSelector('enc.'));
    const urlResolver = new URLResolver(new PrefixSelector('url.'), ConfigFactory.detectFetch(fetchArg));
    const delegatingResolver = new DelegatingResolver(
      [placeHolderResolver, jasyptDecryptor, urlResolver],
    );
    const valueResolvingConfig = new ValueResolvingConfig(config || npmconfig,
      resolver || delegatingResolver);

    placeHolderResolver.reference = valueResolvingConfig;
    return valueResolvingConfig;
  }
};
