var ConfigFactory = (function () {

  class EphemeralConfig {
    constructor(object, path) {
      const self = this;
      this.object = object;
      this.path = path;
      if (this.object) {
        Object.assign(self, this.object);
      }
    }

    get(path, defaultValue) {
      if (!(typeof this.object?.[path] === 'undefined')) {
        return this.object?.[path];
      }
      const pathSteps = path?.split('.') || [];
      let root = this.object;
      for (let i = 0; i < pathSteps.length && root !== null && root !== undefined; i++) {
        root = root?.[pathSteps[i]];
      }
      if (root) {
        return root;
      }
      if ((typeof defaultValue !== 'undefined')) {
        return defaultValue;
      }
      throw new Error(`Config path ${path} returned no value.`);
    }

    has(path) {
      if (!(typeof this.object?.[path] === 'undefined')) {
        return true;
      }
      const pathSteps = path?.split('.') || [];
      let root = this.object;
      for (let i = 0; i < pathSteps.length && root !== null && root !== undefined; i++) {
        root = root?.[pathSteps[i]];
      }
      return root !== null && root !== undefined;
    }
  }

  /* eslint-disable import/extensions */

  class DelegatingConfig {
    static getTag(value) {
      if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
      }
      return toString.call(value);
    }

    static isObjectLike(value) {
      return typeof value === 'object' && value !== null;
    }

    static isPlainObject(value) {
      if (!DelegatingConfig.isObjectLike(value) || DelegatingConfig.getTag(value) !== '[object Object]') {
        return false;
      }
      if (Object.getPrototypeOf(value) === null) {
        return true;
      }
      let proto = value;
      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }
      return Object.getPrototypeOf(value) === proto;
    }

    constructor(config, path) {
      if (DelegatingConfig.isPlainObject(config)) {
        this.config = new EphemeralConfig(config);
      } else {
        this.config = config;
      }
      const originalConfig = this.config;
      Object.assign(this, config);
      this.config = originalConfig;
      this.path = path;
    }

    has(path) {
      return this.config.has(path);
    }
  }

  /* eslint-disable import/extensions */

  class ValueResolvingConfig extends DelegatingConfig {
    constructor(config, resolver, path, async) {
      super(config, path);
      const self = this;
      this.resolver = resolver;
      if (this.config && !async) {
        this.resolved_config = resolver.resolve(this.path == null ? config : this.config.get(path));
        Object.assign(self, this.resolved_config);
      }

      ValueResolvingConfig.prototype.has = DelegatingConfig.prototype.has;
    }

    get(path, defaultValue) {
      if ((typeof defaultValue !== 'undefined') && this.has(path) === false) {
        return defaultValue;
      }
      return new ValueResolvingConfig(this.config, this.resolver, path).resolved_config;
    }

    async fetch(path, defaultValue) {
      const self = this;
      if (defaultValue && this.has(path) === false) {
        return defaultValue;
      }
      const asyncConfig = new ValueResolvingConfig(this.config, this.resolver, path, true);
      return asyncConfig.resolver.asyncResolve(
        asyncConfig.path == null ? asyncConfig : asyncConfig.config.get(asyncConfig.path),
        self, path,
      );
    }
  }

  class Resolver {
    static isObject(value) {
      const type = typeof value;
      return value != null && (type === 'object' || type === 'function');
    }

    mapValuesDeep(values, callback) {
      if (Resolver.isObject(values)) {
        return Object.fromEntries(
          Object.entries(values).map(([
            key, value]) => [key, this.mapValuesDeep(value, callback)]),
        );
      }
      return callback(values);
    }

    async asyncMapValuesDeep(values, callback) {
      if (Resolver.isObject(values)) {
        return Object.fromEntries(
          Object.entries(values).map(
            async ([key, value]) => [key, this.mapValuesDeep(value, callback)],
          ),
        );
      }
      return callback(values);
    }
  }

  /* eslint-disable import/extensions */

  class DelegatingResolver extends Resolver {
    constructor(resolvers) {
      super();
      this.resolvers = resolvers;
    }

    resolve(config) {
      let resolvedConfig = config;
      for (let i = 0; i < this.resolvers.length; i++) {
        resolvedConfig = this.resolvers[i].resolve(resolvedConfig);
      }
      return resolvedConfig;
    }
  }

  /* eslint-disable import/extensions */

  class SelectiveResolver extends Resolver {
    constructor(selector) {
      super();
      this.selector = selector;
    }
  }

  class Selector {
  }

  /* eslint-disable import/extensions */

  class PlaceHolderSelector extends Selector {
    // eslint-disable-next-line class-methods-use-this
    matches(value) {
      return typeof value === 'string'
              && value.includes('${')
              && value.includes('}')
              && value.indexOf('${') < value.indexOf('}');
    }
  }

  /* eslint-disable import/extensions */

  class PlaceHolderResolver extends SelectiveResolver {
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

  /* eslint-disable import/extensions */

  class PrefixSelector extends Selector {
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

  /* eslint-disable import/extensions */

  class URLResolver extends SelectiveResolver {
    constructor(selector, fetchArg) {
      super(selector || (new PrefixSelector('url.')));
      this.$fetch = fetchArg;
    }

    resolve(config) {
      const self = this;
      const resolvedConfig = Resolver.prototype.mapValuesDeep(config, (v) => {
        if (self.selector.matches(v)) {
          try {
            return v;
          } catch (e) {
            return v;
          }
        }
        return v;
      });
      return resolvedConfig;
    }

    async asyncResolve(config, parentConfig, path) {
      const self = this;
      const resolvedConfig = await Resolver.prototype.asyncMapValuesDeep(config, async (v) => {
        if (self.selector.matches(v)) {
          try {
            const selectedValue = self.selector.resolveValue(v);
            const urlPath = path.substring(0, path.lastIndexOf('.'));
            const method = parentConfig.has(`${urlPath}.method`) ? parentConfig.get(`${urlPath}.method`) : null;
            const authorization = parentConfig.has(`${urlPath}.authorization`) ? parentConfig.get(`${urlPath}.authorization`) : null;
            const body = parentConfig.has(`${urlPath}.body`) ? parentConfig.get(`${urlPath}.body`) : null;
            const headers = parentConfig.has(`${urlPath}.headers`) ? parentConfig.get(`${urlPath}.headers`) : null;
            const fetchedValue = await this.fetch(
              selectedValue, authorization, method, body, headers,
            );
            return fetchedValue;
          } catch (e) {
            return v;
          }
        }
        return v;
      });
      return resolvedConfig;
    }

    async fetch(url, authorization, method, body, headers) {
      if (!this.$fetch) {
        throw new Error('fetch is required');
      }
      const $headers = authorization ? { authorization } : {};
      Object.assign($headers, headers);
      const opts = { method: method || 'get', headers: $headers };
      if (method && method?.toLowerCase() !== 'get' && method?.toLowerCase() !== 'head') {
        Object.assign(opts, JSON.stringify(body || {}));
      }
      return this.$fetch(url, opts).then((res) => res.json());
    }
  }

  /* eslint-disable import/extensions */
  // import ValueResolvingConfig from './ValueResolvingConfig.js';

  class WindowLocationConfig extends DelegatingConfig {

    constructor(config, path) {
      super(config, path);
    }

    // eslint-disable-next-line class-methods-use-this
    has(path) {
      return this.config.has(`${window.location.origin}${window.location.pathname}.${path}`)
          || this.config.has(path);
    }

    get(path, defaultValue) {
      if ((typeof defaultValue !== 'undefined') && this.has(path) === false) {
        return defaultValue;
      }
      if (this.config.has(`${window.location.origin}${window.location.pathname}.${path}`)) {
        return this.config.get(`${window.location.origin}${window.location.pathname}.${path}`);
      }
      return this.config.get(path);
    }
  }

  /* eslint-disable import/extensions */

  class ConfigFactory {
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

  return ConfigFactory;

})();
