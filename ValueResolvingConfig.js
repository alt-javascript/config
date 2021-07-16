const _ = require('lodash');
const DelegatingConfig = require('./DelegatingConfig');

module.exports = class ValueResolvingConfig extends DelegatingConfig {
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
    if (defaultValue && this.has(path) === false) {
      return defaultValue;
    }
    return new ValueResolvingConfig(this.config, this.resolver, path).resolved_config;
  }

  async fetch (path, defaultValue){
    if (defaultValue && this.has(path) === false) {
      return defaultValue;
    }
    let asyncConfig = new ValueResolvingConfig(this.config, this.resolver, path, true);
    return await asyncConfig.resolver.asyncResolve(asyncConfig.path == null ? asyncConfig : asyncConfig.config.get(asyncConfig.path));
  }
};
