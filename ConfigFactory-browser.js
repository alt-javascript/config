/* eslint-disable import/extensions */
import ValueResolvingConfig from './ValueResolvingConfig.js';
import DelegatingResolver from './DelegatingResolver.js';
import PlaceHolderResolver from './PlaceHolderResolver.js';
import PlaceHolderSelector from './PlaceHolderSelector.js';
import PrefixSelector from './PrefixSelector.js';
import URLResolver from './URLResolver.js';
import WindowLocationConfig from './WindowLocationConfig.js';

export default class ConfigFactory {
  static getGlobalRef() {
    let $globalref = null;
    if (ConfigFactory.detectBrowser()) {
      $globalref = window;
    } else {
      $globalref = global;
    }
    return $globalref;
  }

  static getGlobalRoot(key) {
    const $globalref = ConfigFactory.getGlobalRef();
    let $key = ($globalref && $globalref.boot);
    $key = $key && $key.contexts;
    $key = $key && $key.root;
    $key = $key && $key[`${key}`];
    return $key;
  }

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
    if (ConfigFactory.getGlobalRoot('fetch')) {
      $fetch = ConfigFactory.getGlobalRoot('fetch');
    }
    $fetch = fetchArg || $fetch;
    return $fetch;
  }

  static getConfig(config, resolver, fetchArg) {
    const placeHolderResolver = new PlaceHolderResolver(new PlaceHolderSelector());
    const urlResolver = new URLResolver(new PrefixSelector('url.'), ConfigFactory.detectFetch(fetchArg));
    const delegatingResolver = new DelegatingResolver(
      [placeHolderResolver, urlResolver],
    );
    const valueResolvingConfig = new ValueResolvingConfig(config,
      resolver || delegatingResolver);

    placeHolderResolver.reference = valueResolvingConfig;
    const windowLocationConfig = new WindowLocationConfig(valueResolvingConfig);
    return windowLocationConfig;
  }
}
