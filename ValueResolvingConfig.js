const _ = require('lodash');
const DelegatingConfig = require('./DelegatingConfig');

module.exports = class ValueResolvingConfig extends DelegatingConfig {
  constructor(config, resolver, path) {
    super(config, path);
    const self = this;
    this.resolver = resolver;
    if (this.config) {
      this.resolved_config = resolver.resolve(this.path == null ? config : this.config.get(path));
      _.assignIn(self, resolver.resolve(this.path == null ? this.config : this.config.get(path)));
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
    return this.get(path, defaultValue);
  }
};
