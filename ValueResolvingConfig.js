/* eslint-disable import/extensions */
import _ from 'lodash';
import DelegatingConfig from './DelegatingConfig.js';

export default class ValueResolvingConfig extends DelegatingConfig {
  constructor(config, resolver, path, async) {
    super(config, path);
    const self = this;
    this.resolver = resolver;
    if (this.config && !async) {
      this.resolved_config = resolver.resolve(this.path == null ? config : this.config.get(path));
      _.assignIn(self, this.resolved_config);
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
