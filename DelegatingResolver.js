const Resolver = require('./Resolver');

module.exports = class DelegatingResolver extends Resolver {
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
};
